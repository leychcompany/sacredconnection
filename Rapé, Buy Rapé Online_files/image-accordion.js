jQuery(document).ready(function($) {
    var acc = document.getElementsByClassName("accordion");
    var lastClicked;

    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            if (lastClicked === this) {
                var link = $(this).data('link');
                var target = $(this).data('target');
                var nofollow = $(this).data('nofollow');
                if (link) {
                    var a = $('<a>', {
                        href: link,
                        target: target,
                        rel: nofollow
                    }).appendTo('body');
                    a[0].click();
                    a.remove();
                }
            } else {
                for (var j = 0; j < acc.length; j++) {
                    acc[j].classList.remove("active");
                }
                this.classList.add("active");
                lastClicked = this;
            }
        });
    }
});














