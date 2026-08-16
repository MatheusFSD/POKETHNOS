package com.pokethnos.web.dto;

import java.util.List;
import java.util.Map;

public class RegionDto {
    public String id;
    public String name;
    public String color;
    public List<Integer> tokens;
    /** playerId -> quantidade de marcadores de controle nessa região */
    public Map<Integer, Integer> markers;
}
