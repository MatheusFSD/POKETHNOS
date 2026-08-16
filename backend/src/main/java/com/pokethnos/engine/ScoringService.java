package com.pokethnos.engine;

import com.pokethnos.domain.Jogador;
import com.pokethnos.domain.Regiao;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/** Espelha js/scoring.js -> endEra(). */
@Service
public class ScoringService {

    /** Descarta as mãos, pontua a Era corrente e marca a partida como phase=SCORING. */
    public EraSummary endEra(GerenciadorJogo jogo) {
        for (Jogador p : jogo.getJogadores()) {
            p.descartarMao(jogo.tableCards());
        }

        EraSummary summary = new EraSummary(jogo.getEra());
        for (Jogador p : jogo.getJogadores()) {
            summary.regionPointsByPlayer.put(p.getId(), 0);
        }

        scoreRegions(jogo, summary);
        scoreBands(jogo, summary);

        for (Jogador p : jogo.getJogadores()) {
            p.adicionarPontos(summary.regionPointsByPlayer.get(p.getId()));
            summary.totalGloryByPlayer.put(p.getId(), p.getPontosTotais());
        }

        jogo.setLastEraSummary(summary);
        jogo.setPhase(GerenciadorJogo.Phase.SCORING);
        return summary;
    }

    private void scoreRegions(GerenciadorJogo jogo, EraSummary summary) {
        int numTiers = jogo.getEra();
        List<Regiao> regioes = jogo.getTabuleiro().getRegioes();

        for (Regiao regiao : regioes) {
            EraSummary.RegionScoreRow row = new EraSummary.RegionScoreRow();
            row.regionId = regiao.getId();
            row.regionName = regiao.getNome();

            List<int[]> counts = new ArrayList<>(); // [playerId, count]
            for (Jogador p : jogo.getJogadores()) {
                int count = p.getMarcadores(regiao.getId());
                row.markerCounts.put(p.getId(), count);
                if (count > 0) counts.add(new int[]{p.getId(), count});
            }
            counts.sort((a, b) -> b[1] - a[1]);

            List<Integer> tokenVals = regiao.tokens(jogo.isIs23());
            List<int[]> remaining = new ArrayList<>(counts);
            int rank = 1;
            while (!remaining.isEmpty() && rank <= numTiers) {
                int topCount = remaining.get(0)[1];
                List<int[]> tied = new ArrayList<>();
                for (int[] entry : remaining) if (entry[1] == topCount) tied.add(entry);

                int tierValue = tokenVals.get(numTiers - rank);
                int pts = tierValue / tied.size();

                EraSummary.RankTier tier = new EraSummary.RankTier();
                tier.rank = rank;
                tier.pointsEach = pts;
                for (int[] entry : tied) {
                    tier.playerIds.add(entry[0]);
                    summary.regionPointsByPlayer.merge(entry[0], pts, Integer::sum);
                }
                row.tiers.add(tier);

                remaining.removeAll(tied);
                rank++;
            }
            summary.regionRows.add(row);
        }
    }

    private void scoreBands(GerenciadorJogo jogo, EraSummary summary) {
        List<Jogador> jogadores = jogo.getJogadores();
        for (int i = 0; i < jogadores.size(); i++) {
            Jogador p = jogadores.get(i);
            List<Integer> sizes = jogo.getBandsPlayedThisEra().get(i);

            EraSummary.BandScoreRow row = new EraSummary.BandScoreRow();
            row.playerId = p.getId();
            int total = 0;
            for (int size : sizes) {
                int pts = GameData.gloryFor(size);
                row.bandSizes.add(size);
                row.pointsPerBand.add(pts);
                total += pts;
            }
            row.totalPoints = total;
            summary.bandRows.add(row);

            p.adicionarPontos(total);
        }
    }
}
