package app.hitcheck.model;

import java.io.Serializable;
import java.util.Locale;

public class Result implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String x;
    private final String y;
    private final String r;
    private final boolean hit;
    private final boolean fromCanvas;
    private final String currentTime;
    private final long execTimeNanos;

    public Result(String x, String y, String r, boolean hit, boolean fromCanvas,
                  String currentTime, long execTimeNanos) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.fromCanvas = fromCanvas;
        this.currentTime = currentTime;
        this.execTimeNanos = execTimeNanos;
    }

    public String getX() {
        return x;
    }

    public String getY() {
        return y;
    }

    public String getR() {
        return r;
    }

    public boolean isHit() {
        return hit;
    }

    public boolean isFromCanvas() {
        return fromCanvas;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public String getExecTimeMicros() {
        return String.format(Locale.US, "%.1f", execTimeNanos / 1000.0);
    }
}
