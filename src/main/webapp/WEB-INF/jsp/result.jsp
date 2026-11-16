<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результат проверки</title>
    <link rel="stylesheet" href="${ctx}/static/style.css">
</head>
<body>

<table id="header">
    <tbody>
    <tr><td><h1>Результат проверки</h1></td></tr>
    </tbody>
</table>

<table id="layout">
    <tbody>
    <tr>
        <c:choose>
            <c:when test="${not empty error}">
                <td>
                    <table class="panel">
                        <tbody>
                        <tr>
                            <td>
                                <p class="section-title">Некорректный запрос</p>
                                <p class="hit-no"><c:out value="${error}"/></p>
                                <a class="back-link" href="${ctx}/controller">← Вернуться к форме</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </c:when>
            <c:otherwise>
                <td style="width:420px;">
                    <table class="panel">
                        <tbody>
                        <tr>
                            <td>
                                <canvas id="plane-result" width="400" height="400"></canvas>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <table class="panel">
                        <tbody>
                        <tr>
                            <td>
                                <p class="section-title">Полученные параметры</p>
                                <table class="results-table">
                                    <thead>
                                    <tr>
                                        <th>X</th>
                                        <th>Y</th>
                                        <th>R</th>
                                        <th>Источник</th>
                                        <th>Текущее время</th>
                                        <th>Время работы, мкс</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr id="result-row" data-x="${result.x}" data-y="${result.y}"
                                        data-r="${result.r}" data-hit="${result.hit}">
                                        <td><c:out value="${result.x}"/></td>
                                        <td><c:out value="${result.y}"/></td>
                                        <td><c:out value="${result.r}"/></td>
                                        <td>${result.fromCanvas ? 'клик по графику' : 'форма'}</td>
                                        <td><c:out value="${result.currentTime}"/></td>
                                        <td><c:out value="${result.execTimeMicros}"/></td>
                                    </tr>
                                    </tbody>
                                </table>

                                <p class="verdict">
                                    Результат:
                                    <span class="${result.hit ? 'hit-yes' : 'hit-no'}">
                                        ${result.hit ? 'точка попадает в область' : 'точка не попадает в область'}
                                    </span>
                                </p>

                                <a class="back-link" href="${ctx}/controller">← Вернуться к форме</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </c:otherwise>
        </c:choose>
    </tr>
    </tbody>
</table>

<c:if test="${empty error}">
    <script src="${ctx}/static/graph.js"></script>
    <script>
        (function () {
            const row = document.getElementById('result-row');
            const graph = Graph.create(document.getElementById('plane-result'));
            graph.draw(Number(row.dataset.r), Graph.readPoints('#result-row'));
        })();
    </script>
</c:if>
</body>
</html>
