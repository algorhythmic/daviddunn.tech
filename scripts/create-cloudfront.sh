#!/bin/bash

# Create CloudFront distribution
aws cloudfront create-distribution \
    --origin-domain-name daviddunn.tech.s3.us-east-2.amazonaws.com \
    --default-root-object index.html \
    --default-cache-behavior "{
        \"TargetOriginId\": \"S3-daviddunn.tech\",
        \"ViewerProtocolPolicy\": \"redirect-to-https\",
        \"AllowedMethods\": {
            \"Quantity\": 7,
            \"Items\": [\"GET\", \"HEAD\", \"OPTIONS\", \"PUT\", \"POST\", \"PATCH\", \"DELETE\"],
            \"CachedMethods\": {
                \"Quantity\": 2,
                \"Items\": [\"GET\", \"HEAD\"]
            }
        },
        \"ForwardedValues\": {
            \"QueryString\": false,
            \"Cookies\": {
                \"Forward\": \"none\"
            }
        },
        \"MinTTL\": 0,
        \"DefaultTTL\": 86400,
        \"MaxTTL\": 31536000
    }" \
    --enabled true \
    --comment "CloudFront distribution for daviddunn.tech photos" \
    --price-class PriceClass_100
