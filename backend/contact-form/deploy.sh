#!/usr/bin/env bash
# Deploy handlera formularza kontaktowego mioduszewsky.com.
# Tworzy: IAM role (least privilege: tylko ses:SendEmail na identity domeny + logi),
# funkcję Lambda (Node 20, 256MB, timeout 10s), Function URL z CORS, log retention 14 dni.
# Idempotentny: przy ponownym uruchomieniu aktualizuje kod/konfig.
# Region: eu-central-1. Uruchamiać PO weryfikacji domeny w SES.
set -euo pipefail
export AWS_PAGER=""

REGION="eu-central-1"
ACCOUNT="068765434892"
FN="mioduszewsky-contact-form"
ROLE="mioduszewsky-contact-form-role"
IDENTITY_ARN="arn:aws:ses:${REGION}:${ACCOUNT}:identity/mioduszewsky.com"
TAGS="Project=mioduszewsky,Env=prod,Owner=Kacper"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Pakowanie kodu"
cd "$DIR"
rm -f function.zip
zip -q function.zip index.mjs

echo "==> IAM role (least privilege)"
if ! aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \
    --tags Key=Project,Value=mioduszewsky Key=Env,Value=prod Key=Owner,Value=Kacper >/dev/null
  aws iam attach-role-policy --role-name "$ROLE" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole >/dev/null
  echo "    role utworzona, czekam 10s na propagację IAM"
  sleep 10
fi
# Polityka inline: tylko wysyłka przez tę jedną tożsamość SES.
aws iam put-role-policy --role-name "$ROLE" --policy-name ses-send-scoped \
  --policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"ses:SendEmail\"],\"Resource\":\"${IDENTITY_ARN}\"}]}" >/dev/null

ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${ROLE}"

echo "==> Lambda"
ENV="Variables={TO_ADDR=kacper@mioduszewsky.com,FROM_ADDR=formularz@mioduszewsky.com,ALLOWED_ORIGINS='https://mioduszewsky.com,https://www.mioduszewsky.com,https://mioduszewsky-com.vercel.app,http://localhost:4321'}"
if aws lambda get-function --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN" --zip-file fileb://function.zip --region "$REGION" >/dev/null
  aws lambda wait function-updated --function-name "$FN" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FN" --region "$REGION" \
    --environment "$ENV" --memory-size 256 --timeout 10 >/dev/null
else
  aws lambda create-function --function-name "$FN" --region "$REGION" \
    --runtime nodejs20.x --handler index.handler --role "$ROLE_ARN" \
    --zip-file fileb://function.zip --memory-size 256 --timeout 10 \
    --environment "$ENV" \
    --tags "$TAGS" >/dev/null
  aws lambda wait function-active --function-name "$FN" --region "$REGION"
fi

echo "==> Log retention 14 dni"
aws logs put-retention-policy --log-group-name "/aws/lambda/${FN}" \
  --retention-in-days 14 --region "$REGION" 2>/dev/null || true

echo "==> Function URL + CORS"
if ! aws lambda get-function-url-config --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  aws lambda create-function-url-config --function-name "$FN" --region "$REGION" \
    --auth-type NONE \
    --cors 'AllowOrigins=["https://mioduszewsky.com","https://www.mioduszewsky.com","https://mioduszewsky-com.vercel.app","http://localhost:4321"],AllowMethods=["POST"],AllowHeaders=["content-type"],MaxAge=86400' >/dev/null
  aws lambda add-permission --function-name "$FN" --region "$REGION" \
    --statement-id FunctionURLAllowPublicAccess --action lambda:InvokeFunctionUrl \
    --principal '*' --function-url-auth-type NONE >/dev/null
fi

URL=$(aws lambda get-function-url-config --function-name "$FN" --region "$REGION" --query FunctionUrl --output text)
echo ""
echo "==> GOTOWE. Function URL:"
echo "$URL"
