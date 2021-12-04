## What it does
Load the latest version of all secrets in GCP Secret Manager into process.env for a given GCP Project ID.  

## Requirements
- gcloud SDK installed  
- gcloud should be initialized (look for gcloud init)  
- gcloud should be authenticated (look for gcloud auth)  
- GCP Project ID should be available at process.env.GOOGLE_CLOUD_PROJECT, this is done automatically by Google App Engine at runtime. 

## Installation  
```
$ npm i gae-env-loader  
```
## Usage  
```
import { loadSecrets } from "gae-env-loader";
.
.
.
  await loadSecrets(prioritizeLocal);
.
.
.
```
prioritizeLocal: Optional parameter, defaults to true. If process.env.FOO is already set, ignore the secret from GCP Cloud Manager. You can disable this behavior and override local env variables by setting prioritizeLocal as false.