/**
 * Created by grinderspro on 28.11.17.
 */

var artcart = {

    cartData: {},
    $cFooter: $('.cart-wrap .row'),
    $cFooterCount: {},
    $cFooterCost: {},

    init: function () {
        this.$cFooterCount = this.$cFooter.find('.cart-item-info-count');
        this.$cFooterCost = this.$cFooter.find('.cart-item-info-cost');

        this.domainsInCartProcessing();
        this.events();
    },

    /**
     * Вешаем события
     */
    events: function () {
        var th = this;

        core.body.on('click', '.cart-clear', function () {
            th.cartClear();
        });
        core.body.on('click', '.to-cart', function () {
            th.addItem($(this));
        });
        core.body.on('click', '.show-cart-domains', function () {
            th.showCart();
        });
    },

    /**
     * Добавляет домен в корзину (вызывается при клике на иконку add)
     */
    addItem: function (event) {
        var $th = event,
            $domainStr = $th.closest('.sres-domain'),
            domain = $.trim($domainStr.find('.sres-domain-name').text()),
            price = parseInt($.trim($domainStr.find('.sres-domain-info').attr('data-price'))),
            premium = $.trim($domainStr.find("input[name='premium']").val()),
            inPopup = $th.closest('#cart-domains-table').length,
            cartData = this.getCartData() || {};

        if (!price) {
            price = 0;
        }

        if (inPopup) {
            $domainStr.remove();
            $('.sres-wrap').find('.sres-domain-name span:contains(' + domain + ')').closest('.sres-domain').removeClass('in-cart');
            this.delItem(domain);

            if (this.cartCount() === 0) {
                $.magnificPopup.close();
            }
        } else {
            if (!$domainStr.hasClass('in-cart')) {
                $domainStr.addClass('in-cart');

                var $strClone = $domainStr.clone();
                cartData[domain] = {
                    price: price,
                    premium: premium,
                    html: $strClone.wrap('<div class="clone-wrap"></div>').parent('.clone-wrap').html()
                };

                this.setCartData(cartData);
            } else {
                $domainStr.removeClass('in-cart');
                this.delItem(domain);
            }
        }

        this.update();
    },

    /**
     * Удаляет домен из корзины (вызывается при клике на иконку add)
     */
    delItem: function (domain) {
        cartData = this.getCartData();
        delete cartData[domain];

        this.setCartData(cartData);
    },

    /**
     * Возвращает набор доменов, находящихся в корзине (из localStorage['cart'])
     */
    getCartData: function () {
        return JSON.parse(localStorage.getItem('cart'));
    },

    /**
     * Возвращает имена доменов, находящихся в корзине
     */
    getCartDomainsName: function () {
        var domains = [];

        if (this.getCartData() !== null) {
            for (var item in this.getCartData()) {
                domains.push(item);
            }
        }

        return domains;
    },

    /**
     * Записывает набор
     */
    setCartData: function (obj) {
        localStorage.setItem('cart', JSON.stringify(obj));
        return false;
    },

    /**
     * Возвращает колво доменов в корзине
     */
    cartCount: function () {
        return this.getCartData() ? Object.keys(this.getCartData()).length : 0;
    },

    /**
     * Выисление общей стоимости доменов в корзине
     */
    getFullPrice: function () {
        var fullPrice = 0,
            cartData = this.getCartData();

        if (cartData !== null) {
            for (var items in cartData) {
                fullPrice += parseInt(cartData[items].price);
            }
        }

        return fullPrice;
    },

    /**
     * Обновление корзины
     */
    update: function () {
        this.$cFooterCount.html(this.cartCount());
        this.$cFooterCost.html(this.getFullPrice());
        this.setCartImg();
    },

    /**
     * Показывает popup корзины
     */
    showCart: function () {
        if (this.cartCount() > 0) {
            var html = '',
                $data = $('.cart-domains').clone(),
                cartData = this.getCartData();

            for (var key in cartData) {
                obj = cartData[key];

                if (obj) {
                    html += obj.html;
                }

            }

            $data.find('#cart-domains-table').html(html);

            $.magnificPopup.open({
                closeMarkup: '',
                items: {src: $data.html(), type: 'inline'},
            });
        }
    },

    /**
     * Иконка корзины + флаг для кнопки "Регистрация" о том, что корзина не пуста
     */
    setCartImg: function () {
        var $cart = $('.cart-wrap'),
            $sresWrap = $('.sres-wrap'),
            $cartInfoImg = $('.cart-info-item:first').children('img');

        if (this.cartCount() > 0) {
            $cartInfoImg.attr('src', '/html/search/img/icons/cart-ok.png');
            $cart.addClass('not-empty');
            $sresWrap.addClass('not-empty');
        } else {
            $cartInfoImg.attr('src', '/html/search/img/icons/cart-empty.png');
            $cart.removeClass('not-empty');
            $sresWrap.removeClass('not-empty');
        }
    },

    /**
     * Имеется ли в корзине хоть оин премиальный домен?
     */
    isCartPremium: function () {
        var cartData = this.getCartData(),
            premium = 0;

        if (this.cartCount() > 0) {
            for (var key in cartData) {
                if (cartData[key].premium) premium = 1;
            }
        }

        return premium;
    },

    /**
     * Является ли домен премиальным
     */
    idDomainPremium: function (domain) {

    },

    /**
     * Проверяет наличие домена в корзине
     */
    domainInCart: function (domainName) {

        if (!this.getCartData())
            return false;

        return this.getCartData().hasOwnProperty(domainName) ? 1 : 0;
    },

    domainsInCartProcessing: function () {
        var self = this,
            $domains = $('.sres-domain');

        if ($domains.length) $domains.each(function () {
            var $th = $(this),
                domain = $.trim($th.find('.sres-domain-name').text());

            if (self.domainInCart(domain)) $th.addClass('in-cart');
        });
    },

    /**
     * Очищает всю корзину
     */
    cartClear: function () {
        localStorage.removeItem('cart');
        $('.sres-domain.in-cart').removeClass('in-cart');

        this.update();
    }
}

jQuery(document).ready(function ($) {
    artcart.init();
});
