package app.hitcheck;

import java.util.List;

public final class Json {

    private Json() {
    }

    public static String response(Result result, List<Result> history) {
        return "{\"result\":" + result(result) + ",\"history\":" + list(history) + "}";
    }

    public static String historyOnly(List<Result> history) {
        return "{\"history\":" + list(history) + "}";
    }

    public static String error(String message) {
        return "{\"error\":" + str(message) + "}";
    }

    private static String list(List<Result> items) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < items.size(); i++) {
            if (i > 0) sb.append(',');
            sb.append(result(items.get(i)));
        }
        return sb.append(']').toString();
    }

    private static String result(Result r) {
        return "{"
                + "\"x\":" + str(r.x()) + ","
                + "\"y\":" + str(r.y()) + ","
                + "\"r\":" + str(r.r()) + ","
                + "\"hit\":" + r.hit() + ","
                + "\"currentTime\":" + str(r.currentTime()) + ","
                + "\"execTimeNanos\":" + r.execTimeNanos()
                + "}";
    }

    private static String str(String s) {
        StringBuilder sb = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
                }
            }
        }
        return sb.append('"').toString();
    }
}
