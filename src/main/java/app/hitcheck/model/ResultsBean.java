package app.hitcheck.model;

import jakarta.servlet.http.HttpSession;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ResultsBean implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String ATTRIBUTE = "resultsBean";

    private final List<Result> results = new ArrayList<>();
    private String lastR;

    public ResultsBean() {
    }

    public static ResultsBean from(HttpSession session) {
        synchronized (ResultsBean.class) {
            ResultsBean bean = (ResultsBean) session.getAttribute(ATTRIBUTE);
            if (bean == null) {
                bean = new ResultsBean();
                session.setAttribute(ATTRIBUTE, bean);
            }
            return bean;
        }
    }

    public synchronized void addResult(Result result) {
        results.add(result);
        lastR = result.getR();
    }

    public synchronized List<Result> getResults() {
        List<Result> copy = new ArrayList<>(results);
        Collections.reverse(copy);
        return copy;
    }

    public synchronized boolean isEmpty() {
        return results.isEmpty();
    }

    public synchronized String getLastR() {
        return lastR;
    }
}
