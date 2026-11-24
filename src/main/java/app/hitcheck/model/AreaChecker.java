package app.hitcheck.model;

import java.math.BigDecimal;

public final class AreaChecker {

    private static final BigDecimal TWO = BigDecimal.valueOf(2);

    private AreaChecker() {
    }

    public static boolean isHit(BigDecimal x, BigDecimal y, BigDecimal r) {
        return inQuarterCircle(x, y, r) || inRectangle(x, y, r) || inTriangle(x, y, r);
    }

    private static boolean inQuarterCircle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() <= 0 && y.signum() >= 0 && x.multiply(x).add(y.multiply(y)).compareTo(r.multiply(r)) <= 0;
    }

    private static boolean inRectangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() >= 0 && y.signum() >= 0 && x.compareTo(r) <= 0 && y.multiply(TWO).compareTo(r) <= 0;
    }

    private static boolean inTriangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() >= 0 && y.signum() <= 0 && y.compareTo(x.multiply(TWO).subtract(r)) >= 0;
    }
}
