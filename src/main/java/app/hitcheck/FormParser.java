package app.hitcheck;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public final class FormParser {

    private FormParser() {
    }

    public static Map<String, String> parse(String body) {
        Map<String, String> result = new HashMap<>();
        if (body == null || body.isEmpty()) return result;

        for (String pair : body.split("&")) {
            if (pair.isEmpty()) continue;
            int eq = pair.indexOf('=');
            try {
                String key = URLDecoder.decode(eq >= 0 ? pair.substring(0, eq) : pair, StandardCharsets.UTF_8);
                String value = eq >= 0 ? URLDecoder.decode(pair.substring(eq + 1), StandardCharsets.UTF_8) : "";
                result.put(key, value);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return result;
    }
}
