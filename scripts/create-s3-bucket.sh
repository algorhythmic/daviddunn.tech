#!/bin/bash

# Create S3 bucket
aws s3api create-bucket \
    --bucket daviddunn.tech \
    --region us-east-2 \
    --create-bucket-configuration LocationConstraint=us-east-2

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
    --bucket daviddunn.tech \
    --versioning-configuration Status=Enabled

# Create bucket policy
cat > bucket-policy.json << EOL
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::daviddunn.tech/*"
        }
    ]
}
EOL

# Apply bucket policy
aws s3api put-bucket-policy \
    --bucket daviddunn.tech \
    --policy file://bucket-policy.json

# Create folders for photos
aws s3api put-object \
    --bucket daviddunn.tech \
    --key photos/

aws s3api put-object \
    --bucket daviddunn.tech \
    --key photos/thumbnails/

# Enable CORS
cat > cors-policy.json << EOL
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["http://localhost:3000", "https://daviddunn.tech"],
            "ExposeHeaders": ["ETag"]
        }
    ]
}
EOL

aws s3api put-bucket-cors \
    --bucket daviddunn.tech \
    --cors-configuration file://cors-policy.json

# Clean up temporary files
rm bucket-policy.json cors-policy.json
