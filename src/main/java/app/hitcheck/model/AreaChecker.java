package app.hitcheck.model;

import java.math.BigDecimal;

public final class AreaChecker {

    private static final BigDecimal TWO = BigDecimal.valueOf(2);
    private static final BigDecimal FOUR = BigDecimal.valueOf(4);

    private AreaChecker() {
    }

    public static boolean isHit(BigDecimal x, BigDecimal y, BigDecimal r) {
        return inRectangle(x, y, r) || inTriangle(x, y, r) || inQuarterCircle(x, y, r);
    }

    private static boolean inRectangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() >= 0 && y.signum() >= 0
                && x.compareTo(r) <= 0
                && y.multiply(TWO).compareTo(r) <= 0;
    }

    private static boolean inTriangle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() <= 0 && y.signum() >= 0
                && y.multiply(TWO).compareTo(x.multiply(TWO).add(r)) <= 0;
    }

    private static boolean inQuarterCircle(BigDecimal x, BigDecimal y, BigDecimal r) {
        return x.signum() >= 0 && y.signum() <= 0
                && x.multiply(x).add(y.multiply(y)).multiply(FOUR).compareTo(r.multiply(r)) <= 0;
    }
}
