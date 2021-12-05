import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export async function listSecrets(request: { [key: string]: string }) {
  const [secrets] = await client.listSecrets(request);
  return secrets;
}

export async function accessSecretVersion(name: string) {
  const [version] = await client.accessSecretVersion({ name });
  return version;
}

export async function loadSecrets(prioritizeLocal: boolean = true) {
  const gcpProjectId = await client.getProjectId();
  if(!gcpProjectId) throw new Error("Failed to retrieve Project Id. Check if youre authenticated.")
  try {
    const secrets = await listSecrets({ parent: "projects/" + gcpProjectId });
    const promises = [];
    for (let secret of secrets) {
      if (!secret.name)
        throw new Error("Expected a name for secret: " + secret.name);
      const key = secret.name?.split("/")?.[3];
      if (!key) throw new Error("Expected a key for secret: " + secret);
      if(prioritizeLocal && process.env.hasOwnProperty(key)) continue;
      promises.push(accessSecretVersion(secret.name + "/versions/latest"));
    }
    const versions = await Promise.all(promises);
    for (let version of versions) {
      const key = version.name?.split("/")?.[3];
      if (!key) throw new Error("Expected a key for version: " + version);
      if (version?.payload?.data == null)
        throw new Error("Expected a value for version: " + version.name);
      const value = version.payload.data.toString();
      process.env[key] = value;
    }
    console.log(process.env);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const client = new SecretManagerServiceClient();
