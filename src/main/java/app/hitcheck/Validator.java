package app.hitcheck;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;


public final class Validator {

    private static final List<BigDecimal> ALLOWED_X = List.of(
            bd("-5"), bd("-4"), bd("-3"), bd("-2"), bd("-1"),
            bd("0"), bd("1"), bd("2"), bd("3"));

    private static final List<BigDecimal> ALLOWED_R = List.of(
            bd("1"), bd("1.5"), bd("2"), bd("2.5"), bd("3"));

    private static final BigDecimal Y_MIN = bd("-5");
    private static final BigDecimal Y_MAX = bd("3");

    private static final Pattern NUMBER = Pattern.compile("^-?\\d{1,10}(\\.\\d{1,18})?$");

    public record Point(BigDecimal x, BigDecimal y, BigDecimal r) {
    }

    public static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }

    private Validator() {
    }

    public static Point validate(Map<String, String> params) throws ValidationException {
        BigDecimal x = parse(params.get("x"), "X");
        if (ALLOWED_X.stream().noneMatch(a -> a.compareTo(x) == 0)) {
            throw new ValidationException("X должен быть одним из: -5, -4, -3, -2, -1, 0, 1, 2, 3");
        }

        BigDecimal y = parse(params.get("y"), "Y");
        if (y.compareTo(Y_MIN) <= 0 || y.compareTo(Y_MAX) >= 0) {
            throw new ValidationException("Y должен быть в интервале (-5 ... 3)");
        }

        BigDecimal r = parse(params.get("r"), "R");
        if (ALLOWED_R.stream().noneMatch(a -> a.compareTo(r) == 0)) {
            throw new ValidationException("R должен быть одним из: 1, 1.5, 2, 2.5, 3");
        }

        return new Point(x, y, r);
    }

    private static BigDecimal parse(String raw, String name) throws ValidationException {
        if (raw == null || raw.isBlank()) {
            throw new ValidationException("Не передан параметр " + name);
        }
        String s = raw.trim().replace(',', '.');
        if (!NUMBER.matcher(s).matches()) {
            throw new ValidationException(name + " должен быть числом");
        }
        return new BigDecimal(s);
    }

    private static BigDecimal bd(String s) {
        return new BigDecimal(s);
    }
}
