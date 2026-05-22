function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    path: req.path
  });
}

function notFound(req, res) {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
    available: ['/api/chat', '/api/weather/:city', '/api/market', '/api/market/trends', '/api/health']
  });
}

module.exports = { errorHandler, notFound };
