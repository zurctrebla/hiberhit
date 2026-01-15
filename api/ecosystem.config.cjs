module.exports = {
  apps: [{
    name: 'api',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',

    // Variáveis de ambiente
    env: {
      NODE_ENV: 'production',
    },

    // Restart policy
    autorestart: true,
    max_restarts: 10,              // Máximo de 10 restarts em 1 minuto
    min_uptime: '10s',             // Considera crash se cair antes de 10s
    max_memory_restart: '500M',    // Restart se usar mais de 500MB

    // Restart delay
    restart_delay: 4000,           // Aguarda 4s antes de reiniciar
    exp_backoff_restart_delay: 100, // Aumenta delay exponencialmente

    // Logs
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // Monitoramento
    listen_timeout: 3000,          // Timeout para listen
    kill_timeout: 5000,            // Timeout para kill

    // Watch (desabilitado em produção)
    watch: false,

    // Cluster mode (desabilitado, usando fork)
    instances: 1,
  }]
};
