export function ok(res, data) {
  return res.status(200).json({ success: true, data });
}

export function created(res, data) {
  return res.status(201).json({ success: true, data });
}

export function badRequest(res, message, code = 'BAD_REQUEST') {
  return res.status(400).json({ success: false, error: { code, message } });
}

export function unauthorized(res, message = 'Unauthorized', code = 'UNAUTHORIZED') {
  return res.status(401).json({ success: false, error: { code, message } });
}

export function forbidden(res, message = 'Forbidden', code = 'FORBIDDEN') {
  return res.status(403).json({ success: false, error: { code, message } });
}

export function serverError(res, message = 'Internal Server Error', code = 'SERVER_ERROR') {
  return res.status(500).json({ success: false, error: { code, message } });
}

export function notFound(res, message = 'Resource not found') {
  return res.status(404).json({ success: false, error: message });
}

