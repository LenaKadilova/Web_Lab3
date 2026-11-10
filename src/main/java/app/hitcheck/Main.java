package app.hitcheck;

import com.fastcgi.FCGIInterface;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


public class Main {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    private static final List<Result> history = new ArrayList<>();

    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();
        while (fcgi.FCGIaccept() >= 0) {
            long start = System.nanoTime();
            try {
                handleRequest(start);
            } catch (Exception e) {
                sendJson(500, "Internal Server Error",
                        Json.error("Внутренняя ошибка сервера"));
            }
        }
    }

    private static void handleRequest(long start) throws IOException {
        String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD", "");

        if ("GET".equals(method)) {
            sendJson(200, "OK", Json.historyOnly(history));
            return;
        }
        if (!"POST".equals(method)) {
            sendJson(405, "Method Not Allowed", Json.error("Разрешены только методы GET и POST"));
            return;
        }

        String body = readBody();
        Map<String, String> params = FormParser.parse(body);

        Validator.Point point;
        try {
            point = Validator.validate(params);
        } catch (Validator.ValidationException e) {
            sendJson(400, "Bad Request", Json.error(e.getMessage()));
            return;
        }

        boolean hit = AreaChecker.isHit(point.x(), point.y(), point.r());
        String now = LocalDateTime.now().format(TIME_FORMAT);
        long execNanos = System.nanoTime() - start;

        Result result = new Result(point.x().toPlainString(), point.y().toPlainString(), point.r().toPlainString(), hit, now, execNanos);
        history.add(result);

        sendJson(200, "OK", Json.response(result, history));
    }

    private static String readBody() throws IOException {
        String lenStr = FCGIInterface.request.params.getProperty("CONTENT_LENGTH", "0");
        int len;
        try {
            len = Integer.parseInt(lenStr.trim());
        } catch (NumberFormatException e) {
            len = 0;
        }
        if (len <= 0) return "";
        if (len > 10000) len = 10000;

        InputStream in = FCGIInterface.request.inStream;
        byte[] buf = new byte[len];
        int read = 0;
        while (read < len) {
            int n = in.read(buf, read, len - read);
            if (n < 0) break;
            read += n;
        }
        return new String(buf, 0, read, StandardCharsets.UTF_8);
    }

    private static void sendJson(int code, String status, String json) {
        byte[] body = json.getBytes(StandardCharsets.UTF_8);
        String headers = "HTTP/1.1 " + code + " " + status + "\r\n"
                + "Content-Type: application/json; charset=utf-8\r\n"
                + "Content-Length: " + body.length + "\r\n"
                + "Cache-Control: no-store\r\n"
                + "\r\n";
        byte[] head = headers.getBytes(StandardCharsets.UTF_8);
        PrintStream out = System.out;
        out.write(head, 0, head.length);
        out.write(body, 0, body.length);
        out.flush();
    }
}
