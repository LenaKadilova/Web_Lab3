<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%-- Bean со списком результатов: берётся из сессии, если его там нет — создаётся --%>
<jsp:useBean id="resultsBean" class="app.hitcheck.model.ResultsBean" scope="session"/>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Лабораторная работа №3</title>
    <link rel="stylesheet" href="${ctx}/static/style.css">
</head>
<body>

<table id="header">
    <tbody>
    <tr><td><h1>Лабораторная работа №3</h1></td></tr>
    <tr><td class="header-row">Студент: Кадилова Елена Владимировна</td></tr>
    <tr><td class="header-row">Группа: Веб-пр (P3215) 1.8</td></tr>
    <tr><td class="header-row">Вариант: 222</td></tr>
    </tbody>
</table>

<table id="layout">
    <tbody>
    <tr>
        <td style="width:420px;">
            <table class="panel">
                <tbody>
                <tr>
                    <td>
                        <p class="section-title">Область (кликните, чтобы проверить точку)</p>
                        <canvas id="plane" width="400" height="400"></canvas>
                        <div class="error-text" id="canvas-error"></div>
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
                        <p class="section-title">Проверка точки</p>
                        <form id="point-form" action="${ctx}/controller" method="get" novalidate>
                            <table class="form-table">
                                <tbody>
                                <tr>
                                    <td class="label-cell">X:</td>
                                    <td class="check-group">
                                        <c:forEach var="xv" items="-5,-4,-3,-2,-1,0,1,2,3">
                                            <label><input type="checkbox" name="x" value="${xv}"> ${xv}</label>
                                        </c:forEach>
                                    </td>
                                </tr>
                                <tr><td></td><td class="error-text" id="x-error"></td></tr>
                                <tr>
                                    <td class="label-cell"><label for="y-input">Y (-5 ... 3):</label></td>
                                    <td><input type="text" id="y-input" name="y" maxlength="30"
                                               placeholder="например, 1.5" autocomplete="off"></td>
                                </tr>
                                <tr><td></td><td class="error-text" id="y-error"></td></tr>
                                <tr>
                                    <td class="label-cell">R:</td>
                                    <td class="check-group">
                                        <c:forEach var="rv" items="1,2,3,4,5">
                                            <label><input type="checkbox" name="r" value="${rv}"
                                                    ${resultsBean.lastR == rv ? 'checked' : ''}> ${rv}</label>
                                        </c:forEach>
                                    </td>
                                </tr>
                                <tr><td></td><td class="error-text" id="r-error"></td></tr>
                                <tr>
                                    <td colspan="2"><button type="submit">Проверить</button></td>
                                </tr>
                                </tbody>
                            </table>
                        </form>
                    </td>
                </tr>
                </tbody>
            </table>

            <table class="panel" style="margin-top:14px;">
                <tbody>
                <tr>
                    <td>
                        <p class="section-title">Результаты проверок</p>
                        <table class="results-table">
                            <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                                <th>R</th>
                                <th>Результат</th>
                                <th>Текущее время</th>
                                <th>Время работы, мкс</th>
                            </tr>
                            </thead>
                            <tbody id="results-body">
                            <c:choose>
                                <c:when test="${empty resultsBean.results}">
                                    <tr><td colspan="6">Проверок пока не было</td></tr>
                                </c:when>
                                <c:otherwise>
                                    <c:forEach var="res" items="${resultsBean.results}">
                                        <tr data-x="${res.x}" data-y="${res.y}" data-r="${res.r}" data-hit="${res.hit}">
                                            <td><c:out value="${res.x}"/></td>
                                            <td><c:out value="${res.y}"/></td>
                                            <td><c:out value="${res.r}"/></td>
                                            <td class="${res.hit ? 'hit-yes' : 'hit-no'}">${res.hit ? 'Попадание' : 'Мимо'}</td>
                                            <td><c:out value="${res.currentTime}"/></td>
                                            <td><c:out value="${res.execTimeMicros}"/></td>
                                        </tr>
                                    </c:forEach>
                                </c:otherwise>
                            </c:choose>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>

<script src="${ctx}/static/graph.js"></script>
<script src="${ctx}/static/form.js"></script>
</body>
</html>
