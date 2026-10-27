import { existsSync } from 'node:fs';
import path from 'node:path';

const requiredPortIds = ['intellij', 'chrome', 'zen'];
const allowedVariants = new Set(['pelagic', 'trench', 'hadal', 'benthic']);
const allowedStatuses = new Set(['source', 'published']);

function fail(index, field, message) {
  throw new Error(`ports[${index}].${field} ${message}`);
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateHttpsUrl(value, index, field) {
  if (typeof value !== 'string') fail(index, field, 'must be an HTTPS URL');

  let url;
  try {
    url = new URL(value);
  } catch {
    fail(index, field, 'must be a valid HTTPS URL');
  }

  if (url.protocol !== 'https:' || !url.hostname) {
    fail(index, field, 'must be an HTTPS URL');
  }
}

function validateScreenshot(value, index, root) {
  const field = 'screenshot';
  if (typeof value !== 'string' || !value.startsWith('/app-shots/')) {
    fail(index, field, 'must be a local /app-shots/ path');
  }

  const publicRoot = path.resolve(root, 'web/public');
  const filePath = path.resolve(publicRoot, value.slice(1));
  if (!filePath.startsWith(`${publicRoot}${path.sep}`) || !existsSync(filePath)) {
    fail(index, field, `does not exist under web/public: ${value}`);
  }
}

export function validatePorts(ports, { root = process.cwd() } = {}) {
  if (!Array.isArray(ports)) throw new Error('Application ports must be an array');

  const seenIds = new Set();
  ports.forEach((port, index) => {
    if (!isRecord(port)) fail(index, 'record', 'must be an object');

    for (const field of ['id', 'name', 'repository', 'installation', 'status', 'variants']) {
      if (!(field in port)) fail(index, field, 'is required');
    }

    if (typeof port.id !== 'string' || !requiredPortIds.includes(port.id)) {
      fail(index, 'id', `must be one of: ${requiredPortIds.join(', ')}`);
    }
    if (seenIds.has(port.id)) fail(index, 'id', `is duplicated: ${port.id}`);
    seenIds.add(port.id);

    if (typeof port.name !== 'string' || !port.name.trim()) fail(index, 'name', 'must be a non-empty string');
    validateHttpsUrl(port.repository, index, 'repository');
    validateHttpsUrl(port.installation, index, 'installation');
    if (typeof port.status !== 'string' || !allowedStatuses.has(port.status)) {
      fail(index, 'status', `must be one of: ${[...allowedStatuses].join(', ')}`);
    }
    if (!Array.isArray(port.variants) || port.variants.length === 0
      || port.variants.some(variant => typeof variant !== 'string' || !allowedVariants.has(variant))) {
      fail(index, 'variants', `must be a non-empty list from: ${[...allowedVariants].join(', ')}`);
    }
    if ('screenshot' in port) validateScreenshot(port.screenshot, index, root);
  });

  for (const id of requiredPortIds) {
    if (!seenIds.has(id)) throw new Error(`Missing required port: ${id}`);
  }
  if (ports.length !== requiredPortIds.length) {
    throw new Error(`Expected exactly ${requiredPortIds.length} application ports`);
  }

  return ports;
}
