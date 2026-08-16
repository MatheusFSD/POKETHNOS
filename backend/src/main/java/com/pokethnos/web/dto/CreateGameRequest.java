package com.pokethnos.web.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateGameRequest {
    @NotEmpty
    @Size(min = 2, max = 6, message = "O jogo suporta de 2 a 6 jogadores.")
    public List<String> playerNames;
}
