import dotenv from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export async function listSecrets(request: { [key: string]: string }) {
  const [secrets] = await client.listSecrets(request);
  return secrets;
}

export async function accessSecretVersion(name: string) {
  const [version] = await client.accessSecretVersion({ name });
  return version;
}

const client = new SecretManagerServiceClient();

export async function loadSecrets(prioritizeLocal: boolean = true) {
  const gcpProjectId = (() => {
    if (!process.env.GOOGLE_CLOUD_PROJECT) dotenv.config();
    return process.env.GOOGLE_CLOUD_PROJECT;
  })();
  try {
    const secrets = await listSecrets({ parent: "projects/" + gcpProjectId });
    const promises = [];
    for (let secret of secrets) {
      if (!secret.name)
        throw new Error("Expected value for secret: " + secret.name);
      const key = secret.name?.split("/")?.[3];
      if (!key) throw new Error("Expected key for secret: " + secret);
      if(prioritizeLocal && process.env[key]) continue;
      promises.push(accessSecretVersion(secret.name + "/versions/latest"));
    }
    const versions = await Promise.all(promises);
    for (let version of versions) {
      const key = version.name?.split("/")?.[3];
      if (!key) throw new Error("Expected key for version: " + version);
      if (!version?.payload?.data)
        throw new Error("Expected value for version: " + version.name);
      const value = version.payload.data.toString();
      process.env[key] = value;
    }
  } catch (err) {
    console.error(err);
  }
}
