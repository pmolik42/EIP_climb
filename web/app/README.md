# Configure amazon S3
## Prepare the S3 server
add this to your bucket policy permission to allow people the object uploaded to be public

```json
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::testclemclimb/*"
        }
    ]
}
```
## Prepare an amazon user
create IAM to with write/read access to object for the S3 server server

## Configure the credentials on the machine for the IAM user:

create a file ~/.aws/credentials
```ini
[default]

aws_access_key_id = // put your IAM user key id here

aws_secret_access_key = // put your IAM user access key here


```
