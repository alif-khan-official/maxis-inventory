"use strict";

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { publicEncrypt, privateDecrypt } from "crypto";
import { yellow, cyan } from "react-dev-utils/chalk";
import { appPath } from "./paths";

function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
	let encrypted;
	try {
		encrypted = publicEncrypt(cert, Buffer.from("test"));
	} catch (err) {
		throw new Error(
			`The certificate "${yellow(crtFile)}" is invalid.\n${err.message}`
		);
	}

	try {
		privateDecrypt(key, encrypted);
	} catch (err) {
		throw new Error(
			`The certificate key "${yellow(keyFile)}" is invalid.\n${
				err.message
			}`
		);
	}
}

function readEnvFile(file, type) {
	if (!existsSync(file)) {
		throw new Error(
			`You specified ${cyan(
				type
			)} in your env, but the file "${yellow(file)}" cannot be found.`
		);
	}
	return readFileSync(file);
}

function getHttpsConfig() {
	const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
	const isHttps = HTTPS === "true";

	if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
		const crtFile = resolve(appPath, SSL_CRT_FILE);
		const keyFile = resolve(appPath, SSL_KEY_FILE);
		const cert = readEnvFile(crtFile, "SSL_CRT_FILE");
		const key = readEnvFile(crtFile, "SSL_KEY_FILE");
		const config = {
			"cert": cert,
			"key": key
		};

		validateKeyAndCerts({cert, key, keyFile, crtFile });
		return config;
	}
	return isHttps;
}

export default getHttpsConfig;
