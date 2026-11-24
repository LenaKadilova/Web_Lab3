package app.hitcheck.controller;

import app.hitcheck.model.AreaChecker;
import app.hitcheck.model.Result;
import app.hitcheck.model.Validator;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class AreaCheckServlet extends HttpServlet {

    private static final String RESULT_JSP = "/WEB-INF/jsp/result.jsp";
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    static final String RESULTS_ATTR = "results";
    static final String LAST_R_ATTR = "lastR";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        long start = System.nanoTime();

        Validator.Point point;
        try {
            point = Validator.validate(
                    req.getParameterValues("x"),
                    req.getParameterValues("y"),
                    req.getParameterValues("r"),
                    req.getParameter("source"));
        } catch (Validator.ValidationException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            req.setAttribute("error", e.getMessage());
            req.getRequestDispatcher(RESULT_JSP).forward(req, resp);
            return;
        }

        boolean hit = AreaChecker.isHit(point.x(), point.y(), point.r());
        String now = LocalDateTime.now().format(TIME_FORMAT);
        long execNanos = System.nanoTime() - start;

        Result result = new Result(
                point.x().toPlainString(),
                point.y().toPlainString(),
                point.r().toPlainString(),
                hit, point.fromCanvas(), now, execNanos);

        HttpSession session = req.getSession();
        getResults(session).add(0, result);
        session.setAttribute(LAST_R_ATTR, result.getR());

        req.setAttribute("result", result);
        req.getRequestDispatcher(RESULT_JSP).forward(req, resp);
    }

    @SuppressWarnings("unchecked")
    private static List<Result> getResults(HttpSession session) {
        synchronized (AreaCheckServlet.class) {
            List<Result> results = (List<Result>) session.getAttribute(RESULTS_ATTR);
            if (results == null) {
                results = new CopyOnWriteArrayList<>();
                session.setAttribute(RESULTS_ATTR, results);
            }
            return results;
        }
    }
}
