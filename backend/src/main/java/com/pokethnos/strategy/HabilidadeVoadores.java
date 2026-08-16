package com.pokethnos.strategy;

import com.pokethnos.engine.GerenciadorJogo;
import com.pokethnos.engine.PendingDecision;
import com.pokethnos.engine.TurnContext;

/**
 * Espelha js/strategies.js -> HabilidadeVoadores.
 * Deixa o jogador escolher em qual região colocar o marcador (ou nenhuma),
 * pagando um custo por região (ver GameService para o cálculo das opções).
 */
public class HabilidadeVoadores implements EstrategiaHabilidade {
    @Override
    public FlowResult resolverRegiao(GerenciadorJogo jogo, TurnContext ctx) {
        // Só abre a escolha de região se o Líder já poderia colocar marcador
        // na sua própria região (mesma regra de "canPlace" usada pelas demais
        // tribos) — replica fielmente js/turn-actions.js -> showFlyModal().
        if (!ctx.isCanPlace()) {
            ctx.setLeaderRegionId(null);
            return FlowResult.done();
        }
        EstrategiaHabilidade.awaitDecision(jogo, PendingDecision.FLY_REGION);
        return FlowResult.awaitingDecision();
    }
}
