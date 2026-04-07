/// <reference path="../pb_data/types.d.ts" />

// Hook before creating a user
onRecordCreateRequest((e) => {
    if (e.httpContext && e.httpContext.request().header.get("x-bypass-hooks") === "true") {
        return e.next();
    }

    var rawName = e.record.get('name') || '';
    var normalized = rawName.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s/g, '-');

    e.record.set('normalizedName', normalized);
    return e.next();
}, "users");

// Hook before updating a user
onRecordUpdateRequest((e) => {
    if (e.httpContext && e.httpContext.request().header.get("x-bypass-hooks") === "true") {
        return e.next();
    }

    var rawName = e.record.get('name') || '';
    var normalized = rawName.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s/g, '-');

    e.record.set('normalizedName', normalized);
    return e.next();
}, "users");