require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {

    const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
    const keyVaultName = process.env.KEY_VAULT_NAME;

    console.log(secretName);
    console.log(keyVaultName);
    
    if (!secretName || !keyVaultName) throw Error("getSecret: Required params missing");

    connectionString = await getSecret(secretName, keyVaultName);
    process.env.DATABASE_URL = connectionString;

}

async function getConnectionInfo() {
  const azureCosmosUrl = process.env.CUSTOMCONNSTR_AZURE_COSMOS_CONNECTIONSTRING;

  if (!process.env.DATABASE_URL && azureCosmosUrl) {
    process.env.DATABASE_URL = azureCosmosUrl;
  }

  if (!process.env.DATABASE_URL) {
    await putKeyVaultSecretInEnvVar();

    if (!process.env.DATABASE_URL) {
      throw new Error("No value in DATABASE_URL in env var");
    }
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME
  };
}


module.exports = {
  getConnectionInfo
}