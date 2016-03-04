chrome.storage.sync.get({
    token: ''
}, function(items) {
    var cache = {};
    function apiUrl(sha) {
        var ownerRepo = document.location.pathname.match(/([^\/]+)\/([^\/]+)\//);
        return 'https://api.github.com/repos/' + ownerRepo[1] +
            '/' + ownerRepo[2] + '/statuses/' + sha;
    }

    function pageUpdate() {
        $('button[aria-label="Copy the full SHA"]:not(.added-status)').each(function(index, el) {
            $(el).addClass('added-status');
            var sha = $(el).data('clipboard-text');
            if (cache[sha]) return showStatuses(el, cache[sha]);
            $.ajax({
                url: apiUrl(sha),
                headers: { Authorization: 'Bearer ' + items.token },
                success: function(data) {
                    cache[sha] = data;
                    showStatuses(el, cache[sha]);
                }
            });
        });
    }

    function showStatuses(el, data) {
        var wrapper = $(el).parent().parent();
        wrapper.find('.statuses').remove();
        var statuses = $('<div></div>')
            .css('padding', '5px 0');
        wrapper.append(statuses);
        data.reverse().forEach(function(status) {
            var icons = {
                success: 'octicon-check',
                pending: 'octicon-primitive-dot',
                error: 'octicon-alert',
                failure: 'octicon-bug'
            };
            // paths sourced from github: https://github.com/github/octicons
            var icon_svg_paths = {
                success: '<path d="M12 5L4 13 0 9l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5z" />',
                pending: '<path d="M0 8c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4S0 10.2 0 8z" />',
                error: '<path d="M15.72 12.5l-6.85-11.98C8.69 0.21 8.36 0.02 8 0.02s-0.69 0.19-0.87 0.5l-6.85 11.98c-0.18 0.31-0.18 0.69 0 1C0.47 13.81 0.8 14 1.15 14h13.7c0.36 0 0.69-0.19 0.86-0.5S15.89 12.81 15.72 12.5zM9 12H7V10h2V12zM9 9H7V5h2V9z" />',
                failure: '<path d="M11 10h3v-1H11v-1l3.17-1.03-0.34-0.94-2.83 0.97v-1c0-0.55-0.45-1-1-1v-1c0-0.48-0.36-0.88-0.83-0.97l1.03-1.03h1.8V1H9.8L7.8 3h-0.59L5.2 1H3v1h1.8l1.03 1.03c-0.47 0.09-0.83 0.48-0.83 0.97v1c-0.55 0-1 0.45-1 1v1L1.17 6.03l-0.34 0.94 3.17 1.03v1H1v1h3v1L0.83 12.03l0.34 0.94 2.83-0.97v1c0 0.55 0.45 1 1 1h1l1-1V6h1v7l1 1h1c0.55 0 1-0.45 1-1v-1l2.83 0.97 0.34-0.94-3.17-1.03v-1zM9 5H6v-1h3v1z" />'
            }
            var colors = {
                success: 'green',
                failure: 'red',
                pending: 'gray',
                error: 'yellow'
            };
            $('<a></a>')
                .css('color', colors[status.state])
                .css('padding', '1px 2px')
                .attr('class', 'tooltipped tooltipped-s')
                .attr('href', status.target_url)
                .attr('aria-label', status.state + ': ' + status.description)
                .append($('<svg></svg>')
                    .attr('aria-hidden', true)
                    .attr('role', 'img')
                    .attr('version','1.1')
                    .attr('viewbox','0 0 14 16')
                    .attr('class', 'octicon ' + icons[status.state]))
                .append($(icon_svg_paths[status.state]))
                .appendTo(statuses);
        });
    }

    $(function() {
        $(document)
            .on('ready', pageUpdate)
            .bind('DOMSubtreeModified', pageUpdate);
        pageUpdate();
    });
});
