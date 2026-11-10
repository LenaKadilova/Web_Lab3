package app.hitcheck;

public record Result(String x, String y, String r, boolean hit, String currentTime, long execTimeNanos) {
}
