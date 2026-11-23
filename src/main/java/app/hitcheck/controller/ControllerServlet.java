package app.hitcheck.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ControllerServlet extends HttpServlet {

    static final String FORM_JSP = "/WEB-INF/jsp/index.jsp";
    static final String AREA_CHECK_SERVLET = "AreaCheckServlet";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        if (hasPointData(req)) {
            getServletContext().getNamedDispatcher(AREA_CHECK_SERVLET).forward(req, resp);
        } else {
            req.getRequestDispatcher(FORM_JSP).forward(req, resp);
        }
    }

    private static boolean hasPointData(HttpServletRequest req) {
        return req.getParameter("x") != null
                || req.getParameter("y") != null
                || req.getParameter("r") != null;
    }
}
