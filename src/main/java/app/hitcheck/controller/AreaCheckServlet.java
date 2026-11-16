package app.hitcheck.controller;

import app.hitcheck.model.AreaChecker;
import app.hitcheck.model.Result;
import app.hitcheck.model.ResultsBean;
import app.hitcheck.model.Validator;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AreaCheckServlet extends HttpServlet {

    private static final String RESULT_JSP = "/WEB-INF/jsp/result.jsp";
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

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

        ResultsBean.from(req.getSession()).addResult(result);

        req.setAttribute("result", result);
        req.getRequestDispatcher(RESULT_JSP).forward(req, resp);
    }
}
