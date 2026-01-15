#!/bin/bash

# Script de Monitoramento da API
# Uso: bash scripts/monitor-api.sh

echo "========================================"
echo "  MONITORAMENTO DA API - IBERHIT"
echo "========================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Status PM2
echo "📊 Status PM2:"
pm2 status api | grep -E "api|online|restart"

RESTART_COUNT=$(pm2 jlist | grep -o '"restart_time":[0-9]*' | grep -o '[0-9]*' | head -1)
echo ""
echo "Restarts: $RESTART_COUNT"

if [ "$RESTART_COUNT" -gt 5 ]; then
  echo -e "${RED}⚠️  ALERTA: Mais de 5 restarts detectados!${NC}"
else
  echo -e "${GREEN}✅ Restarts normais${NC}"
fi

echo ""
echo "========================================"

# 2. Health Check
echo "🔍 Health Check:"
HEALTH=$(curl -s http://localhost:3001/health)

if echo "$HEALTH" | grep -q "ok"; then
  echo -e "${GREEN}✅ API respondendo${NC}"
  echo "$HEALTH"
else
  echo -e "${RED}❌ API não está respondendo!${NC}"
fi

echo ""
echo "========================================"

# 3. Uso de Memória
echo "💾 Uso de Memória:"
pm2 show api | grep "memory" | head -1

echo ""
echo "========================================"

# 4. Últimos Erros (últimas 20 linhas)
echo "📝 Últimos Erros:"
pm2 logs api --err --lines 5 --nostream

echo ""
echo "========================================"

# 5. Uptime
echo "⏱️  Uptime:"
pm2 show api | grep "uptime" | head -1

echo ""
echo "========================================"
echo "✅ Monitoramento concluído!"
echo ""
echo "Comandos úteis:"
echo "  pm2 logs api        - Ver logs em tempo real"
echo "  pm2 restart api     - Reiniciar API"
echo "  pm2 stop api        - Parar API"
echo "  pm2 delete api      - Remover do PM2"
echo ""
