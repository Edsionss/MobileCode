;(function (V, e) {
  typeof exports == 'object' && typeof module < 'u'
    ? e(exports, require('vue'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue'], e)
    : ((V = typeof globalThis < 'u' ? globalThis : V || self), e((V['vue3-context-menu'] = {}), V.Vue))
})(this, function (V, e) {
  'use strict'
  let Y = null
  function _e() {
    return Y !== null
  }
  function He(t) {
    Y && fe(), (Y = t)
  }
  function de(t) {
    t === Y && (Y = null)
  }
  function fe() {
    Y && (Y.closeMenu(), (Y = null))
  }
  const L = {
    defaultDirection: 'br',
    defaultMinWidth: 100,
    defaultMaxWidth: 600,
    defaultZindex: 100,
    defaultZoom: 1,
    defaultAdjustPadding: { x: 0, y: 10 }
  }
  function U(t, o) {
    let l = t.offsetTop
    return (
      t.offsetParent != null &&
        t.offsetParent != o &&
        ((l -= t.offsetParent.scrollTop), (l += U(t.offsetParent, o))),
      l
    )
  }
  function X(t, o) {
    let l = t.offsetLeft
    return (
      t.offsetParent != null &&
        t.offsetParent != o &&
        ((l -= t.offsetParent.scrollLeft), (l += X(t.offsetParent, o))),
      l
    )
  }
  function Re(t, o, l, u) {
    return { x: X(t, u) + o, y: U(t, u) + l }
  }
  const re = 'mx-menu-default-container',
    Pe = 'mx-menu-container-'
  let Oe = 0
  function he(t) {
    const { getContainer: o, zIndex: l } = t
    if (o) {
      const h = typeof o == 'function' ? o() : o
      if (h) {
        let n = h.getAttribute('id')
        return n || ((n = Pe + Oe++), h.setAttribute('id', n)), { eleId: n, container: h, isNew: !1 }
      }
    }
    let u = document.getElementById(re)
    return (
      u ||
        ((u = document.createElement('div')),
        u.setAttribute('id', re),
        u.setAttribute('class', 'mx-menu-ghost-host fullscreen'),
        document.body.appendChild(u)),
      (u.style.zIndex = (l == null ? void 0 : l.toString()) || L.defaultZindex.toString()),
      { eleId: re, container: u, isNew: !0 }
    )
  }
  function me(t) {
    return typeof t == 'number' ? `${t}px` : t
  }
  const K = e.defineComponent({
    props: { vnode: { type: null }, data: { type: null, default: null } },
    setup(t) {
      const { vnode: o, data: l } = e.toRefs(t)
      return () => (typeof o.value == 'function' ? o.value(l.value) : o.value)
    }
  })
  function Ee(t, o) {
    const l = { ...t }
    return delete l[o], l
  }
  var $e = Object.defineProperty,
    Ne = (t, o, l) =>
      o in t ? $e(t, o, { enumerable: !0, configurable: !0, writable: !0, value: l }) : (t[o] = l),
    pe = (t, o, l) => Ne(t, typeof o != 'symbol' ? o + '' : o, l)
  class ge {
    constructor(o, l) {
      pe(this, 'x', 0), pe(this, 'y', 0), (this.x = o || 0), (this.y = l || 0)
    }
    set(o, l) {
      ;(this.x = o), (this.y = l)
    }
    substract(o) {
      ;(this.x -= o.x), (this.y -= o.y)
    }
  }
  function Ce(t) {
    const { onDown: o, onMove: l, onUp: u } = t,
      h = new ge(),
      n = new ge()
    let C
    function d(f) {
      f.stopPropagation(), n.set(f.x, f.y), n.substract(h), l(h, n, f, C)
    }
    function b(f) {
      u(f, C),
        h.set(0, 0),
        document.removeEventListener('mousemove', d),
        document.removeEventListener('mouseup', b)
    }
    return (f, w) =>
      o(f, w)
        ? ((C = w),
          h.set(f.x, f.y),
          document.addEventListener('mousemove', d),
          document.addEventListener('mouseup', b),
          f.stopPropagation(),
          !0)
        : !1
  }
  function Te(t, o) {
    let l = 0
    return {
      start() {
        l > 0 && clearInterval(l),
          (l = setInterval(() => {
            ;(l = 0), o()
          }, t))
      },
      stop() {
        l > 0 && (clearInterval(l), (l = 0))
      }
    }
  }
  const J = [],
    be = Te(100, () => {
      for (const t of J) t()
    })
  function je(t, o, l, u) {
    let h = 0,
      n = 0
    function C() {
      t.value &&
        (o && h !== t.value.offsetWidth && o(t.value.offsetWidth),
        l && n !== t.value.offsetHeight && l(t.value.offsetHeight),
        u &&
          (h !== t.value.offsetWidth || n !== t.value.offsetHeight) &&
          u(t.value.offsetWidth, t.value.offsetHeight),
        (h = t.value.offsetWidth),
        (n = t.value.offsetHeight))
    }
    return {
      startResizeChecker() {
        be.start(), J.push(C)
      },
      stopResizeChecker() {
        const d = J.indexOf(C)
        d >= 0 && J.splice(d, 1), J.length === 0 && be.stop()
      }
    }
  }
  const ke = 140,
    Le = 70,
    ze = e.defineComponent({
      __name: 'ScrollRect',
      props: {
        scroll: { type: String, default: 'both' },
        scrollBarAlwaysShow: { type: Boolean, default: !1 },
        scrollBarBackgroundClickable: { type: Boolean, default: !1 },
        height: { type: Number, default: void 0 },
        width: { type: Number, default: void 0 },
        maxHeight: { type: Number, default: void 0 },
        maxWidth: { type: Number, default: void 0 },
        containerClass: { type: String, default: '' },
        containerStyle: { type: null }
      },
      emits: ['scroll', 'resized'],
      setup(t, { expose: o, emit: l }) {
        const u = t,
          h = l,
          n = e.ref(),
          C = e.ref(),
          d = e.ref(),
          b = e.ref(),
          f = e.ref(),
          w = e.ref(),
          R = e.ref(!1),
          E = e.computed(() => u.scroll === 'horizontal' || u.scroll === 'both'),
          k = e.computed(() => u.scroll === 'vertical' || u.scroll === 'both'),
          M = e.reactive({ show: !1, size: 0, sizeRaw: 0, pos: 0 }),
          y = e.reactive({ show: !1, size: 0, sizeRaw: 0, pos: 0 })
        let _ = 0,
          a = 0,
          c = 0,
          p = 0,
          S = null
        const P = { attributes: !0, childList: !0 }
        function m() {
          if (n.value) {
            if (M.show) {
              const r = n.value.offsetWidth / n.value.scrollWidth
              ;(M.sizeRaw = r * n.value.offsetWidth),
                (M.size = r * 100),
                (M.pos = (n.value.scrollLeft / (n.value.scrollWidth - n.value.offsetWidth)) * (100 - M.size)),
                r >= 1 && (M.show = !1)
            }
            if (y.show) {
              const r = n.value.offsetHeight / n.value.scrollHeight
              ;(y.sizeRaw = r * n.value.offsetHeight),
                (y.size = r * 100),
                (y.pos = (n.value.scrollTop / (n.value.scrollHeight - n.value.offsetHeight)) * (100 - y.size)),
                r >= 1 && (y.show = !1)
            }
            h('scroll', n.value.scrollLeft, n.value.scrollTop)
          }
        }
        function B(r = !1) {
          if (!n.value) return
          let W = E.value,
            O = k.value
          const ae = W && (_ !== n.value.scrollWidth || c !== n.value.offsetWidth),
            ie = k && (a !== n.value.scrollHeight || p !== n.value.offsetHeight)
          if (!r && !ae && !ie) return
          const q = window.getComputedStyle(n.value)
          ;(q.overflow === 'hidden' || q.overflowX === 'hidden') && (W = !1),
            (q.overflow === 'hidden' || q.overflowY === 'hidden') && (O = !1),
            (M.show = W),
            (y.show = O),
            m(),
            (c = n.value.offsetWidth),
            (p = n.value.offsetHeight),
            (_ = n.value.scrollWidth),
            (a = n.value.scrollHeight),
            h('resized', _, a)
        }
        function H(r) {
          var W
          u.scroll == 'horizontal' &&
            (r.deltaMode == 0 &&
              ((W = n.value) == null ||
                W.scrollTo({ left: n.value.scrollLeft + (r.deltaY > 0 ? ke : -140), behavior: 'smooth' })),
            r.preventDefault(),
            r.stopPropagation())
        }
        function N(r) {
          var W
          r.deltaMode == 0 &&
            ((W = n.value) == null ||
              W.scrollTo({ left: n.value.scrollLeft + (r.deltaY > 0 ? ke : -140), behavior: 'smooth' }),
            r.preventDefault(),
            r.stopPropagation())
        }
        function z(r) {
          var W
          r.deltaMode == 0 &&
            ((W = n.value) == null ||
              W.scrollTo({ top: n.value.scrollTop + (r.deltaY > 0 ? Le : -70), behavior: 'smooth' }),
            r.preventDefault(),
            r.stopPropagation())
        }
        let D = 0,
          T = 0,
          x = 0,
          $ = 0
        const j = Ce({
            onDown(r) {
              return !d.value || !f.value
                ? !1
                : ((D = r.offsetX),
                  (T = r.x - r.offsetX - f.value.offsetLeft),
                  r.preventDefault(),
                  (R.value = !0),
                  !0)
            },
            onMove(r, W, O) {
              n.value && d.value && (s(O.x - D - T), O.preventDefault(), O.stopPropagation())
            },
            onUp() {
              R.value = !1
            }
          }),
          F = Ce({
            onDown(r) {
              return !b.value || !w.value
                ? !1
                : ((x = r.offsetY),
                  ($ = r.y - r.offsetY - w.value.offsetTop),
                  r.preventDefault(),
                  (R.value = !0),
                  !0)
            },
            onMove(r, W, O) {
              n.value && b.value && (g(O.y - x - $), O.preventDefault(), O.stopPropagation())
            },
            onUp() {
              R.value = !1
            }
          })
        function v(r) {
          n.value && (n.value.scrollLeft = (r / 100) * (n.value.scrollWidth - n.value.offsetWidth))
        }
        function Z(r) {
          n.value && (n.value.scrollLeft = (r / 100) * (n.value.scrollHeight - n.value.offsetHeight))
        }
        function s(r) {
          n.value &&
            (n.value.scrollLeft =
              (r / (n.value.offsetWidth - M.sizeRaw)) * (n.value.scrollWidth - n.value.offsetWidth))
        }
        function g(r) {
          n.value &&
            (n.value.scrollTop =
              (r / (n.value.offsetHeight - y.sizeRaw)) * (n.value.scrollHeight - n.value.offsetHeight))
        }
        function I(r) {
          u.scrollBarBackgroundClickable && s(r.offsetX - M.sizeRaw / 2)
        }
        function i(r) {
          u.scrollBarBackgroundClickable && g(r.offsetY - y.sizeRaw / 2)
        }
        const { startResizeChecker: Q, stopResizeChecker: A } = je(
          n,
          () => B(),
          () => B()
        )
        return (
          e.onMounted(() => {
            e.nextTick(() => {
              setTimeout(() => B(!0), 200),
                B(!0),
                Q(),
                (S = new MutationObserver(() => B())),
                S.observe(n.value, P)
            })
          }),
          e.onBeforeUnmount(() => {
            A(), S && (S.disconnect(), (S = null))
          }),
          o({
            refreshScrollState() {
              B(!0)
            },
            getScrollContainer() {
              return n.value
            },
            scrollTo(r, W) {
              var O
              ;(O = n.value) == null || O.scrollTo(r, W)
            },
            scrollToTop() {
              var r
              ;(r = n.value) == null || r.scrollTo(0, 0)
            },
            scrollToBottom() {
              var r
              ;(r = n.value) == null || r.scrollTo(n.value.scrollWidth, n.value.scrollHeight)
            }
          }),
          (r, W) => (
            e.openBlock(),
            e.createElementBlock(
              'div',
              {
                ref_key: 'scrollrect',
                ref: C,
                class: e.normalizeClass([
                  'vue-scroll-rect',
                  t.scrollBarAlwaysShow ? 'always-show-scrollbar' : '',
                  t.scrollBarBackgroundClickable ? 'background-clickable' : '',
                  R.value ? 'dragging' : ''
                ]),
                style: e.normalizeStyle({
                  width: t.width ? `${t.width}px` : void 0,
                  height: t.height ? `${t.height}px` : void 0
                }),
                onWheel: H
              },
              [
                e.createElementVNode(
                  'div',
                  {
                    ref_key: 'container',
                    ref: n,
                    class: e.normalizeClass(['scroll-content', t.scroll, t.containerClass]),
                    style: e.normalizeStyle({
                      maxWidth: t.maxWidth ? `${t.maxWidth}px` : void 0,
                      maxHeight: t.maxHeight ? `${t.maxHeight}px` : void 0,
                      ...t.containerStyle
                    }),
                    onScroll: m
                  },
                  [e.renderSlot(r.$slots, 'default')],
                  38
                ),
                M.show
                  ? e.renderSlot(r.$slots, 'scrollBarX', { key: 0, scrollBarValue: M, onScroll: v }, () => [
                      e.createElementVNode(
                        'div',
                        {
                          ref_key: 'scrollBarRefX',
                          ref: d,
                          class: 'scrollbar horizontal',
                          onClick: I,
                          onWheel: N
                        },
                        [
                          e.createElementVNode(
                            'div',
                            {
                              class: 'thumb',
                              ref_key: 'scrollBarThumbRefX',
                              ref: f,
                              style: e.normalizeStyle({ left: `${M.pos}%`, width: `${M.size}%` }),
                              onMousedown: W[0] || (W[0] = (...O) => e.unref(j) && e.unref(j)(...O)),
                              onWheel: N
                            },
                            null,
                            36
                          )
                        ],
                        544
                      )
                    ])
                  : e.createCommentVNode('', !0),
                y.show
                  ? e.renderSlot(r.$slots, 'scrollBarY', { key: 1, scrollBarValue: y, onScroll: Z }, () => [
                      y.show
                        ? (e.openBlock(),
                          e.createElementBlock(
                            'div',
                            {
                              key: 0,
                              ref_key: 'scrollBarRefY',
                              ref: b,
                              class: 'scrollbar vertical',
                              onClick: i,
                              onWheel: z
                            },
                            [
                              e.createElementVNode(
                                'div',
                                {
                                  class: 'thumb',
                                  ref_key: 'scrollBarThumbRefY',
                                  ref: w,
                                  style: e.normalizeStyle({ top: `${y.pos}%`, height: `${y.size}%` }),
                                  onMousedown: W[1] || (W[1] = (...O) => e.unref(F) && e.unref(F)(...O)),
                                  onWheel: z
                                },
                                null,
                                36
                              )
                            ],
                            544
                          ))
                        : e.createCommentVNode('', !0)
                    ])
                  : e.createCommentVNode('', !0)
              ],
              38
            )
          )
        )
      }
    }),
    ne = (t, o) => {
      const l = t.__vccOpts || t
      for (const [u, h] of o) l[u] = h
      return l
    },
    Ve = {},
    Fe = { class: 'mx-checked-mark', 'aria-hidden': 'true', viewBox: '0 0 1024 1024' },
    Ae = [
      e.createElementVNode(
        'path',
        { d: 'M129.3,428.6L52,512l345,372.5l575-620.8l-69.5-75L400.4,718.2L129.3,428.6z' },
        null,
        -1
      )
    ]
  function De(t, o) {
    return e.openBlock(), e.createElementBlock('svg', Fe, Ae)
  }
  const Ke = ne(Ve, [['render', De]]),
    Ye = {},
    Ue = { class: 'mx-right-arrow', 'aria-hidden': 'true', viewBox: '0 0 1024 1024' },
    Xe = [
      e.createElementVNode(
        'path',
        {
          d: 'M307.018 49.445c11.517 0 23.032 4.394 31.819 13.18L756.404 480.18c8.439 8.438 13.181 19.885 13.181 31.82s-4.741 23.38-13.181 31.82L338.838 961.376c-17.574 17.573-46.065 17.573-63.64-0.001-17.573-17.573-17.573-46.065 0.001-63.64L660.944 512 275.198 126.265c-17.574-17.573-17.574-46.066-0.001-63.64C283.985 53.839 295.501 49.445 307.018 49.445z'
        },
        null,
        -1
      )
    ]
  function Ze(t, o) {
    return e.openBlock(), e.createElementBlock('svg', Ue, Xe)
  }
  const Ge = ne(Ye, [['render', Ze]]),
    qe = { class: 'mx-item-row' },
    Je = ['xlink:href'],
    Qe = { key: 1, class: 'label' },
    et = { class: 'mx-item-row' },
    tt = { class: 'mx-shortcut' },
    oe = e.defineComponent({
      __name: 'ContextMenuItem',
      props: {
        disabled: { type: Boolean, default: !1 },
        hidden: { type: Boolean, default: !1 },
        customRender: { type: Function, default: null },
        customClass: { type: String, default: '' },
        clickHandler: { type: Function, default: null },
        label: { type: [String, Object, Function], default: '' },
        icon: { type: [String, Object, Function], default: '' },
        iconFontClass: { type: String, default: 'iconfont' },
        checked: { type: Boolean, default: !1 },
        shortcut: { type: String, default: '' },
        svgIcon: { type: String, default: '' },
        svgProps: { type: Object, default: null },
        preserveIconWidth: { type: Boolean, default: !0 },
        showRightArrow: { type: Boolean, default: !1 },
        hasChildren: { type: Boolean, default: !1 },
        clickClose: { type: Boolean, default: !0 },
        clickableWhenHasChildren: { type: Boolean, default: !1 },
        rawMenuItem: { type: Object, default: void 0 }
      },
      emits: ['click', 'subMenuOpen', 'subMenuClose'],
      setup(t, { expose: o, emit: l }) {
        const u = t,
          h = l,
          {
            clickHandler: n,
            clickClose: C,
            clickableWhenHasChildren: d,
            disabled: b,
            hidden: f,
            label: w,
            icon: R,
            iconFontClass: E,
            showRightArrow: k,
            shortcut: M,
            hasChildren: y
          } = e.toRefs(u),
          _ = e.ref(!1),
          a = e.ref(!1),
          c = e.ref(),
          p = e.inject('globalOptions'),
          S = e.inject('globalHasSlot'),
          P = e.inject('globalRenderSlot'),
          m = e.inject('globalCloseMenu'),
          B = e.inject('menuContext'),
          H = {
            getSubMenuInstance: () => {},
            showSubMenu: () => (_.value ? (B.markActiveMenuItem(H, !0), !0) : y.value ? (z(), !0) : !1),
            hideSubMenu: () => {
              B.closeOtherSubMenu()
            },
            isDisabledOrHidden: () => b.value || f.value,
            getElement: () => c.value,
            focus: () => (a.value = !0),
            blur: () => (a.value = !1),
            click: N
          }
        e.provide('menuItemInstance', H),
          e.onMounted(() => {
            B.isMenuItemDataCollectedFlag()
              ? e.nextTick(() => {
                  let x = 0
                  const $ = B.getElement()
                  if ($) {
                    let j = 0
                    for (let F = 0; F < $.children.length; F++) {
                      const v = $.children[F]
                      if (v.getAttribute('data-type') === 'ContextMenuItem') {
                        if (v === c.value) {
                          x = j
                          break
                        }
                        j++
                      }
                    }
                  }
                  B.addChildMenuItem(H, x)
                })
              : B.addChildMenuItem(H)
          }),
          e.onBeforeUnmount(() => {
            B.removeChildMenuItem(H)
          })
        function N(x) {
          if (!b.value) {
            if (x) {
              const $ = x.target
              if (
                $.classList.contains('mx-context-no-clickable') ||
                (p.value.ignoreClickClassName && $.classList.contains(p.value.ignoreClickClassName))
              )
                return
              if (p.value.clickCloseClassName && $.classList.contains(p.value.clickCloseClassName)) {
                x.stopPropagation(), m(u.rawMenuItem)
                return
              }
            }
            y.value
              ? d.value
                ? (typeof n.value == 'function' && n.value(x), h('click', x))
                : _.value || z()
              : (typeof n.value == 'function' && n.value(x), h('click', x), C.value && m(u.rawMenuItem))
          }
        }
        function z(x) {
          ;(a.value = !1),
            B.checkCloseOtherSubMenuTimeOut() || B.closeOtherSubMenu(),
            b.value ||
              (B.markActiveMenuItem(H),
              y.value &&
                (x || B.markThisOpenedByKeyBoard(),
                B.addOpenedSubMenu(D),
                (_.value = !0),
                e.nextTick(() => h('subMenuOpen', H))))
        }
        function D() {
          ;(a.value = !1), (_.value = !1), h('subMenuClose', H)
        }
        function T() {
          return {
            disabled: b.value,
            label: w.value,
            icon: R.value,
            iconFontClass: E.value,
            showRightArrow: k.value,
            clickClose: C.value,
            clickableWhenHasChildren: d.value,
            shortcut: M.value,
            theme: p.value.theme,
            isOpen: _,
            hasChildren: y,
            onClick: N,
            onMouseEnter: z,
            closeMenu: m
          }
        }
        return (
          o(H),
          (x, $) =>
            e.unref(f)
              ? e.createCommentVNode('', !0)
              : (e.openBlock(),
                e.createElementBlock(
                  'div',
                  {
                    key: 0,
                    class: 'mx-context-menu-item-wrapper',
                    ref_key: 'menuItemRef',
                    ref: c,
                    'data-type': 'ContextMenuItem'
                  },
                  [
                    e.unref(S)('itemRender')
                      ? (e.openBlock(),
                        e.createBlock(
                          e.unref(K),
                          { key: 0, vnode: () => e.unref(P)('itemRender', T()) },
                          null,
                          8,
                          ['vnode']
                        ))
                      : t.customRender
                      ? (e.openBlock(),
                        e.createBlock(e.unref(K), { key: 1, vnode: t.customRender, data: T() }, null, 8, [
                          'vnode',
                          'data'
                        ]))
                      : (e.openBlock(),
                        e.createElementBlock(
                          'div',
                          {
                            key: 2,
                            class: e.normalizeClass([
                              'mx-context-menu-item',
                              e.unref(b) ? 'disabled' : '',
                              a.value ? 'keyboard-focus' : '',
                              t.customClass ? ' ' + t.customClass : '',
                              _.value ? 'open' : ''
                            ]),
                            onClick: N,
                            onMouseenter: z
                          },
                          [
                            e.renderSlot(x.$slots, 'default', {}, () => [
                              e.createElementVNode('div', qe, [
                                e.createElementVNode(
                                  'div',
                                  {
                                    class: e.normalizeClass([
                                      'mx-icon-placeholder',
                                      t.preserveIconWidth ? 'preserve-width' : ''
                                    ])
                                  },
                                  [
                                    e.renderSlot(x.$slots, 'icon', {}, () => [
                                      e.unref(S)('itemIconRender')
                                        ? (e.openBlock(),
                                          e.createBlock(
                                            e.unref(K),
                                            { key: 0, vnode: () => e.unref(P)('itemIconRender', T()) },
                                            null,
                                            8,
                                            ['vnode']
                                          ))
                                        : typeof t.svgIcon == 'string' && t.svgIcon
                                        ? (e.openBlock(),
                                          e.createElementBlock(
                                            'svg',
                                            e.mergeProps({ key: 1, class: 'icon svg' }, t.svgProps),
                                            [
                                              e.createElementVNode('use', { 'xlink:href': t.svgIcon }, null, 8, Je)
                                            ],
                                            16
                                          ))
                                        : typeof e.unref(R) != 'string'
                                        ? (e.openBlock(),
                                          e.createBlock(
                                            e.unref(K),
                                            { key: 2, vnode: e.unref(R), data: e.unref(R) },
                                            null,
                                            8,
                                            ['vnode', 'data']
                                          ))
                                        : typeof e.unref(R) == 'string' && e.unref(R) !== ''
                                        ? (e.openBlock(),
                                          e.createElementBlock(
                                            'i',
                                            {
                                              key: 3,
                                              class: e.normalizeClass(
                                                e.unref(R) + ' icon ' + e.unref(E) + ' ' + e.unref(p).iconFontClass
                                              )
                                            },
                                            null,
                                            2
                                          ))
                                        : e.createCommentVNode('', !0)
                                    ]),
                                    t.checked
                                      ? e.renderSlot(x.$slots, 'check', { key: 0 }, () => [
                                          e.unref(S)('itemCheckRender')
                                            ? (e.openBlock(),
                                              e.createBlock(
                                                e.unref(K),
                                                { key: 0, vnode: () => e.unref(P)('itemCheckRender', T()) },
                                                null,
                                                8,
                                                ['vnode']
                                              ))
                                            : e.createCommentVNode('', !0),
                                          e.createVNode(Ke)
                                        ])
                                      : e.createCommentVNode('', !0)
                                  ],
                                  2
                                ),
                                e.renderSlot(x.$slots, 'label', {}, () => [
                                  e.unref(S)('itemLabelRender')
                                    ? (e.openBlock(),
                                      e.createBlock(
                                        e.unref(K),
                                        { key: 0, vnode: () => e.unref(P)('itemLabelRender', T()) },
                                        null,
                                        8,
                                        ['vnode']
                                      ))
                                    : typeof e.unref(w) == 'string'
                                    ? (e.openBlock(),
                                      e.createElementBlock('span', Qe, e.toDisplayString(e.unref(w)), 1))
                                    : (e.openBlock(),
                                      e.createBlock(
                                        e.unref(K),
                                        { key: 2, vnode: e.unref(w), data: e.unref(w) },
                                        null,
                                        8,
                                        ['vnode', 'data']
                                      ))
                                ])
                              ]),
                              e.createElementVNode('div', et, [
                                e.unref(M) || x.$slots.shortcut
                                  ? e.renderSlot(x.$slots, 'shortcut', { key: 0 }, () => [
                                      e.unref(S)('itemShortcutRender')
                                        ? (e.openBlock(),
                                          e.createBlock(
                                            e.unref(K),
                                            { key: 0, vnode: () => e.unref(P)('itemShortcutRender', T()) },
                                            null,
                                            8,
                                            ['vnode']
                                          ))
                                        : e.createCommentVNode('', !0),
                                      e.createElementVNode('span', tt, e.toDisplayString(e.unref(M)), 1)
                                    ])
                                  : e.createCommentVNode('', !0),
                                e.unref(k)
                                  ? e.renderSlot(x.$slots, 'rightArrow', { key: 1 }, () => [
                                      e.unref(S)('itemRightArrowRender')
                                        ? (e.openBlock(),
                                          e.createBlock(
                                            e.unref(K),
                                            { key: 0, vnode: () => e.unref(P)('itemRightArrowRender', T()) },
                                            null,
                                            8,
                                            ['vnode']
                                          ))
                                        : e.createCommentVNode('', !0),
                                      e.createVNode(Ge)
                                    ])
                                  : e.createCommentVNode('', !0)
                              ])
                            ])
                          ],
                          34
                        )),
                    e.unref(p).menuTransitionProps
                      ? (e.openBlock(),
                        e.createBlock(
                          e.Transition,
                          e.normalizeProps(e.mergeProps({ key: 3 }, e.unref(p).menuTransitionProps)),
                          {
                            default: e.withCtx(() => [
                              _.value
                                ? e.renderSlot(x.$slots, 'submenu', { key: 0, context: H })
                                : e.createCommentVNode('', !0)
                            ]),
                            _: 3
                          },
                          16
                        ))
                      : _.value
                      ? e.renderSlot(x.$slots, 'submenu', { key: 4, context: H })
                      : e.createCommentVNode('', !0)
                  ],
                  512
                ))
        )
      }
    }),
    nt = e.defineComponent({
      name: 'ContextMenuSperator',
      components: { VNodeRender: K },
      setup() {
        const t = e.inject('globalHasSlot'),
          o = e.inject('globalRenderSlot')
        return { globalHasSlot: t, globalRenderSlot: o }
      }
    }),
    ot = { key: 1, class: 'mx-context-menu-item-sperator mx-context-no-clickable' }
  function lt(t, o, l, u, h, n) {
    const C = e.resolveComponent('VNodeRender')
    return t.globalHasSlot('separatorRender')
      ? (e.openBlock(),
        e.createBlock(C, { key: 0, vnode: () => t.globalRenderSlot('separatorRender', {}) }, null, 8, ['vnode']))
      : (e.openBlock(), e.createElementBlock('div', ot))
  }
  const G = ne(nt, [['render', lt]]),
    le = e.defineComponent({
      __name: 'ContextSubMenu',
      props: {
        items: { type: Object, default: null },
        maxHeight: { type: Number, default: 0 },
        maxWidth: { type: [String, Number], default: 0 },
        minWidth: { type: [String, Number], default: 0 },
        adjustPosition: { type: Boolean, default: !0 },
        direction: { type: String, default: 'br' },
        parentMenuItemContext: { type: Object, default: null }
      },
      setup(t, { expose: o }) {
        const l = t,
          u = e.ref(!1),
          h = e.inject('globalGetMenuHostId', ''),
          n = e.inject('menuContext'),
          C = e.inject('globalOptions')
        e.inject('globalHasSlot'), e.inject('globalRenderSlot')
        const { zIndex: d, getParentWidth: b, getParentHeight: f, getZoom: w } = n,
          { adjustPosition: R } = e.toRefs(l),
          E = e.ref(),
          k = e.ref(),
          M = e.ref(),
          y = [],
          _ = e.inject('globalSetCurrentSubMenu'),
          a = []
        let c = null,
          p = 0
        function S() {
          c && c.blur()
        }
        function P(s, g) {
          if (s) {
            for (let I = g !== void 0 ? g : 0; I < a.length; I++)
              if (!a[I].isDisabledOrHidden()) {
                m(I)
                break
              }
          } else
            for (let I = g !== void 0 ? g : a.length - 1; I >= 0; I--)
              if (!a[I].isDisabledOrHidden()) {
                m(I)
                break
              }
        }
        function m(s) {
          var I
          if ((c && S(), s !== void 0 && (c = a[Math.max(0, Math.min(s, a.length - 1))]), !c)) return
          c.focus()
          const g = c.getElement()
          g &&
            ((I = E.value) == null ||
              I.scrollTo(0, Math.min(Math.max(-$.value, -g.offsetTop - g.offsetHeight + j.value), 0)))
        }
        function B() {
          _(H)
        }
        const H = {
          isTopLevel: () => n.getParentContext() === null,
          closeSelfAndActiveParent: () => {
            const s = D.getParentContext()
            if (s) {
              s.closeOtherSubMenu()
              const g = s.getSubMenuInstanceContext()
              if (g) return g.focusCurrentItem(), !0
            }
            return !1
          },
          closeCurrentSubMenu: () => {
            var s
            return (s = D.getParentContext()) == null ? void 0 : s.closeOtherSubMenu()
          },
          moveCurrentItemFirst: () => P(!0),
          moveCurrentItemLast: () => P(!1),
          moveCurrentItemDown: () => P(!0, c ? a.indexOf(c) + 1 : 0),
          moveCurrentItemUp: () => P(!1, c ? a.indexOf(c) - 1 : 0),
          focusCurrentItem: () => m(),
          openCurrentItemSubMenu: () => (c ? (c == null ? void 0 : c.showSubMenu()) : !1),
          triggerCurrentItemClick: s => (c == null ? void 0 : c.click(s))
        }
        let N = !1,
          z = !1
        const D = {
          zIndex: d + 1,
          container: n.container,
          adjustPadding: C.value.adjustPadding || L.defaultAdjustPadding,
          getParentWidth: () => {
            var s
            return ((s = M.value) == null ? void 0 : s.offsetWidth) || 0
          },
          getParentHeight: () => {
            var s
            return ((s = M.value) == null ? void 0 : s.offsetHeight) || 0
          },
          getPositon: () => [v.value.x, v.value.y],
          getZoom: () => C.value.zoom || L.defaultZoom,
          addOpenedSubMenu(s) {
            y.push(s)
          },
          closeOtherSubMenu() {
            y.forEach(s => s()), y.splice(0, y.length), _(H)
          },
          checkCloseOtherSubMenuTimeOut() {
            return p ? (clearTimeout(p), (p = 0), !0) : !1
          },
          closeOtherSubMenuWithTimeOut() {
            p = setTimeout(() => {
              ;(p = 0), this.closeOtherSubMenu()
            }, 200)
          },
          addChildMenuItem: (s, g) => {
            g === void 0 ? a.push(s) : a.splice(g, 0, s)
          },
          removeChildMenuItem: s => {
            a.splice(a.indexOf(s), 1), (s.getSubMenuInstance = () => {})
          },
          markActiveMenuItem: (s, g = !1) => {
            S(), (c = s), g && m()
          },
          markThisOpenedByKeyBoard: () => {
            N = !0
          },
          isOpenedByKeyBoardFlag: () => (N ? ((N = !1), !0) : !1),
          isMenuItemDataCollectedFlag: () => z,
          getElement: () => M.value || null,
          getParentContext: () => n,
          getSubMenuInstanceContext: () => H
        }
        e.provide('menuContext', D)
        const T = {
            getChildItem: s => a[s],
            getMenuDimensions: () =>
              k.value ? { width: k.value.offsetWidth, height: k.value.offsetHeight } : { width: 0, height: 0 },
            getSubmenuRoot: () => k.value,
            getMenu: () => M.value,
            getScrollValue: () => {
              var s, g
              return (
                ((g = (s = E.value) == null ? void 0 : s.getScrollContainer()) == null ? void 0 : g.scrollTop) || 0
              )
            },
            setScrollValue: s => {
              var g
              return (g = E.value) == null ? void 0 : g.scrollTo(0, s)
            },
            getScrollHeight: () => $.value,
            adjustPosition: () => {
              Z()
            },
            getMaxHeight: () => j.value,
            getPosition: () => v.value,
            setPosition: (s, g) => {
              ;(v.value.x = s), (v.value.y = g)
            }
          },
          x = e.inject('menuItemInstance', void 0)
        x && (x.getSubMenuInstance = () => T)
        const $ = e.ref(0),
          j = e.ref(0),
          F = e.ref(!1),
          v = e.ref({ x: 0, y: 0 })
        function Z() {
          e.nextTick(() => {
            const s = M.value,
              g = k.value
            if (s && g && E.value) {
              const { container: I } = n,
                i = (b == null ? void 0 : b()) ?? 0,
                Q = (f == null ? void 0 : f()) ?? 0,
                A = getComputedStyle(g),
                r = parseFloat(A.paddingLeft),
                W = parseFloat(A.paddingTop),
                O = Q > 0 ? W : 0,
                ae = document.documentElement.scrollHeight / w(),
                ie = document.documentElement.scrollWidth / w(),
                q = Math.min(ie, I.offsetWidth),
                Be = Math.min(ae, I.offsetHeight)
              let ce = X(s, I),
                ue = U(s, I)
              l.direction.includes('l')
                ? (v.value.x -= s.offsetWidth + r)
                : l.direction.includes('r')
                ? (v.value.x += i + r)
                : ((v.value.x += i / 2), (v.value.x -= (s.offsetWidth + r) / 2)),
                l.direction.includes('t')
                  ? (v.value.y -= (s.offsetHeight + W * 2) / w())
                  : l.direction.includes('b')
                  ? (v.value.y -= W / w())
                  : (v.value.y -= (s.offsetHeight + W) / 2 / w()),
                e.nextTick(() => {
                  var Ie, We
                  ;(ce = X(s, I)), (ue = U(s, I))
                  const we =
                      ((We = (Ie = E.value) == null ? void 0 : Ie.getScrollContainer()) == null
                        ? void 0
                        : We.scrollHeight) || 0,
                    ht = l.maxHeight
                  $.value = l.maxHeight ? Math.min(we, l.maxHeight) : we
                  const mt = ce + s.offsetWidth - q,
                    ve = ue + $.value + O * 2 - Be
                  if (((F.value = ve > 0), R.value && mt > 0)) {
                    const ee = i + s.offsetWidth - r,
                      te = ce
                    ee > te ? (v.value.x -= te) : (v.value.x -= ee)
                  }
                  if (F.value) {
                    if (R.value) {
                      const ee = ve,
                        te = ue
                      ee > te ? (v.value.y -= te - O) : (v.value.y -= ee - O)
                    }
                    j.value = Be - (v.value.y + W)
                  } else j.value = ht || 0
                })
            }
            s == null || s.focus({ preventScroll: !0 }), n.isOpenedByKeyBoardFlag() && P(!0), (z = !0)
          })
        }
        return (
          e.onMounted(() => {
            var g
            u.value = !0
            const s = (g = l.parentMenuItemContext) == null ? void 0 : g.getElement()
            if (s) {
              const I = X(s, n.container),
                i = U(s, n.container)
              ;(v.value.x = I), (v.value.y = i)
            } else {
              const [I, i] = n.getPositon()
              ;(v.value.x = I), (v.value.y = i)
            }
            _(H), Z()
          }),
          e.onBeforeUnmount(() => {
            ;(u.value = !1), x && (x.getSubMenuInstance = () => {})
          }),
          o(T),
          (s, g) => {
            const I = e.resolveComponent('ContextSubMenu', !0)
            return u.value
              ? (e.openBlock(),
                e.createBlock(
                  e.Teleport,
                  { key: 0, to: `#${e.unref(h)}` },
                  [
                    e.createElementVNode(
                      'div',
                      e.mergeProps({ ref_key: 'submenuRoot', ref: k }, s.$attrs, {
                        class: [
                          'mx-context-menu',
                          e.unref(C).customClass ? e.unref(C).customClass : '',
                          e.unref(C).theme ?? ''
                        ],
                        style: {
                          maxWidth: t.maxWidth ? e.unref(me)(t.maxWidth) : `${e.unref(L).defaultMaxWidth}px`,
                          minWidth: t.minWidth ? e.unref(me)(t.minWidth) : `${e.unref(L).defaultMinWidth}px`,
                          zIndex: e.unref(d),
                          left: `${v.value.x}px`,
                          top: `${v.value.y}px`
                        },
                        'data-type': 'ContextSubMenu',
                        onClick: B
                      }),
                      [
                        e.createVNode(
                          e.unref(ze),
                          {
                            ref_key: 'scrollRectRef',
                            ref: E,
                            scroll: 'vertical',
                            maxHeight: j.value,
                            containerClass: 'mx-context-menu-scroll'
                          },
                          {
                            default: e.withCtx(() => [
                              e.createElementVNode(
                                'div',
                                { class: e.normalizeClass(['mx-context-menu-items']), ref_key: 'menu', ref: M },
                                [
                                  e.renderSlot(s.$slots, 'default', {}, () => [
                                    (e.openBlock(!0),
                                    e.createElementBlock(
                                      e.Fragment,
                                      null,
                                      e.renderList(
                                        t.items,
                                        (i, Q) => (
                                          e.openBlock(),
                                          e.createElementBlock(
                                            e.Fragment,
                                            { key: Q },
                                            [
                                              i.hidden !== !0 && i.divided === 'up'
                                                ? (e.openBlock(), e.createBlock(G, { key: 0 }))
                                                : e.createCommentVNode('', !0),
                                              i.hidden !== !0 && i.divided === 'self'
                                                ? (e.openBlock(), e.createBlock(G, { key: 1 }))
                                                : (e.openBlock(),
                                                  e.createBlock(
                                                    oe,
                                                    {
                                                      key: 2,
                                                      clickHandler: i.onClick ? A => i.onClick(A) : void 0,
                                                      disabled:
                                                        typeof i.disabled == 'object'
                                                          ? i.disabled.value
                                                          : i.disabled,
                                                      hidden:
                                                        typeof i.hidden == 'object' ? i.hidden.value : i.hidden,
                                                      icon: i.icon,
                                                      iconFontClass: i.iconFontClass,
                                                      svgIcon: i.svgIcon,
                                                      svgProps: i.svgProps,
                                                      label: i.label,
                                                      customRender: i.customRender,
                                                      customClass: i.customClass,
                                                      checked:
                                                        typeof i.checked == 'object' ? i.checked.value : i.checked,
                                                      shortcut: i.shortcut,
                                                      clickClose: i.clickClose,
                                                      clickableWhenHasChildren: i.clickableWhenHasChildren,
                                                      preserveIconWidth:
                                                        i.preserveIconWidth !== void 0
                                                          ? i.preserveIconWidth
                                                          : e.unref(C).preserveIconWidth,
                                                      showRightArrow: i.children && i.children.length > 0,
                                                      hasChildren: i.children && i.children.length > 0,
                                                      rawMenuItem: i,
                                                      onSubMenuOpen: A => {
                                                        var r
                                                        return (r = i.onSubMenuOpen) == null
                                                          ? void 0
                                                          : r.call(i, A)
                                                      },
                                                      onSubMenuClose: A => {
                                                        var r
                                                        return (r = i.onSubMenuClose) == null
                                                          ? void 0
                                                          : r.call(i, A)
                                                      }
                                                    },
                                                    e.createSlots({ _: 2 }, [
                                                      i.children && i.children.length > 0
                                                        ? {
                                                            name: 'submenu',
                                                            fn: e.withCtx(({ context: A }) => [
                                                              e.createVNode(
                                                                I,
                                                                {
                                                                  parentMenuItemContext: A,
                                                                  items: i.children,
                                                                  maxWidth: i.maxWidth,
                                                                  minWidth: i.minWidth,
                                                                  maxHeight: i.maxHeight,
                                                                  adjustPosition:
                                                                    i.adjustSubMenuPosition !== void 0
                                                                      ? i.adjustSubMenuPosition
                                                                      : e.unref(C).adjustPosition,
                                                                  direction:
                                                                    i.direction !== void 0
                                                                      ? i.direction
                                                                      : e.unref(C).direction
                                                                },
                                                                null,
                                                                8,
                                                                [
                                                                  'parentMenuItemContext',
                                                                  'items',
                                                                  'maxWidth',
                                                                  'minWidth',
                                                                  'maxHeight',
                                                                  'adjustPosition',
                                                                  'direction'
                                                                ]
                                                              )
                                                            ]),
                                                            key: '0'
                                                          }
                                                        : void 0
                                                    ]),
                                                    1032,
                                                    [
                                                      'clickHandler',
                                                      'disabled',
                                                      'hidden',
                                                      'icon',
                                                      'iconFontClass',
                                                      'svgIcon',
                                                      'svgProps',
                                                      'label',
                                                      'customRender',
                                                      'customClass',
                                                      'checked',
                                                      'shortcut',
                                                      'clickClose',
                                                      'clickableWhenHasChildren',
                                                      'preserveIconWidth',
                                                      'showRightArrow',
                                                      'hasChildren',
                                                      'rawMenuItem',
                                                      'onSubMenuOpen',
                                                      'onSubMenuClose'
                                                    ]
                                                  )),
                                              i.hidden !== !0 && (i.divided === 'down' || i.divided === !0)
                                                ? (e.openBlock(), e.createBlock(G, { key: 3 }))
                                                : e.createCommentVNode('', !0)
                                            ],
                                            64
                                          )
                                        )
                                      ),
                                      128
                                    ))
                                  ])
                                ],
                                512
                              )
                            ]),
                            _: 3
                          },
                          8,
                          ['maxHeight']
                        )
                      ],
                      16
                    )
                  ],
                  8,
                  ['to']
                ))
              : e.createCommentVNode('', !0)
          }
        )
      }
    }),
    Ct = '',
    ye = e.defineComponent({
      __name: 'ContextSubMenuWrapper',
      props: {
        options: { type: Object, default: null },
        show: { type: Boolean, default: null },
        container: { type: Object, default: null },
        isFullScreenContainer: { type: Boolean, default: !0 }
      },
      emits: ['close', 'closeAnimFinished'],
      setup(t, { expose: o, emit: l }) {
        const u = t,
          h = l,
          n = e.useSlots(),
          C = e.ref(),
          { options: d, show: b, container: f } = e.toRefs(u)
        e.onMounted(() => {
          b.value && E()
        }),
          e.onBeforeUnmount(() => {
            _()
          }),
          e.watch(b, m => {
            m ? E() : (de(w), _())
          })
        const w = {
          closeMenu: k,
          isClosed: M,
          getMenuRef: () => C.value,
          getMenuDimensions: () => {
            var m
            return ((m = C.value) == null ? void 0 : m.getMenuDimensions()) ?? { width: 0, height: 0 }
          }
        }
        let R = !1
        function E() {
          y(), He(w)
        }
        function k(m) {
          ;(R = !0), h('close', m), d.value.menuTransitionProps || h('closeAnimFinished'), de(w)
        }
        function M() {
          return R
        }
        function y() {
          setTimeout(() => {
            document.addEventListener('click', S, !0),
              document.addEventListener('contextmenu', S, !0),
              document.addEventListener('scroll', p, !0),
              !u.isFullScreenContainer && f.value && f.value.addEventListener('scroll', p, !0),
              d.value.keyboardControl !== !1 && document.addEventListener('keydown', c, !0)
          }, 50)
        }
        function _() {
          document.removeEventListener('contextmenu', S, !0),
            document.removeEventListener('click', S, !0),
            document.removeEventListener('scroll', p, !0),
            !u.isFullScreenContainer && f.value && f.value.removeEventListener('scroll', p, !0),
            d.value.keyboardControl !== !1 && document.removeEventListener('keydown', c, !0)
        }
        const a = e.ref()
        e.provide('globalSetCurrentSubMenu', m => (a.value = m)), e.provide('globalGetMenuHostId', f.value.id)
        function c(m) {
          var H, N, z, D, T, x, $, j, F, v, Z, s, g
          let B = !0
          switch (m.key) {
            case 'Escape': {
              ;((H = a.value) == null ? void 0 : H.isTopLevel()) === !1
                ? (N = a.value) == null || N.closeCurrentSubMenu()
                : k()
              break
            }
            case 'ArrowDown':
              ;(z = a.value) == null || z.moveCurrentItemDown()
              break
            case 'ArrowUp':
              ;(D = a.value) == null || D.moveCurrentItemUp()
              break
            case 'Home':
              ;(T = a.value) == null || T.moveCurrentItemFirst()
              break
            case 'End':
              ;(x = a.value) == null || x.moveCurrentItemLast()
              break
            case 'ArrowLeft': {
              ;(($ = a.value) != null && $.closeSelfAndActiveParent()) ||
                (F = (j = d.value).onKeyFocusMoveLeft) == null ||
                F.call(j)
              break
            }
            case 'ArrowRight':
              ;((v = a.value) != null && v.openCurrentItemSubMenu()) ||
                (s = (Z = d.value).onKeyFocusMoveRight) == null ||
                s.call(Z)
              break
            case 'Enter':
              ;(g = a.value) == null || g.triggerCurrentItemClick(m)
              break
            default:
              B = !1
              break
          }
          B && a.value && (m.stopPropagation(), m.preventDefault())
        }
        function p(m) {
          d.value.closeWhenScroll !== !1 && P(m.target, null)
        }
        function S(m) {
          P(m.target, m)
        }
        function P(m, B) {
          var H, N
          for (; m; ) {
            if (m.classList && m.classList.contains('mx-context-menu')) return
            m = m.parentNode
          }
          B
            ? d.value.clickCloseOnOutside !== !1
              ? (_(), k())
              : (N = (H = d.value).onClickOnOutside) == null || N.call(H, B)
            : (_(), k())
        }
        return (
          e.provide('globalOptions', d),
          e.provide('globalCloseMenu', k),
          e.provide('globalIsFullScreenContainer', u.isFullScreenContainer),
          e.provide('globalHasSlot', m => n[m] !== void 0),
          e.provide('globalRenderSlot', (m, B) =>
            e.renderSlot(n, m, { ...B }, () => [e.h('span', 'Render slot failed')], !1)
          ),
          e.provide('menuContext', {
            zIndex: d.value.zIndex || L.defaultZindex,
            container: f.value,
            adjustPadding: { x: 0, y: 0 },
            getZoom: () => d.value.zoom || L.defaultZoom,
            getParentWidth: () => 0,
            getParentHeight: () => 0,
            getPositon: () => [d.value.x, d.value.y],
            closeOtherSubMenuWithTimeOut: () => {},
            checkCloseOtherSubMenuTimeOut: () => !1,
            addOpenedSubMenu: () => {},
            closeOtherSubMenu: () => {},
            getParentContext: () => null,
            getSubMenuInstanceContext: () => null,
            getElement: () => null,
            addChildMenuItem: () => {},
            removeChildMenuItem: () => {},
            markActiveMenuItem: () => {},
            markThisOpenedByKeyBoard: () => {},
            isOpenedByKeyBoardFlag: () => !1,
            isMenuItemDataCollectedFlag: () => !1
          }),
          o(w),
          (m, B) =>
            e.unref(d).menuTransitionProps
              ? (e.openBlock(),
                e.createBlock(
                  e.Transition,
                  e.mergeProps({ key: 0, appear: '' }, e.unref(d).menuTransitionProps, {
                    onAfterLeave: B[0] || (B[0] = H => h('closeAnimFinished'))
                  }),
                  {
                    default: e.withCtx(() => [
                      e.unref(b)
                        ? (e.openBlock(),
                          e.createBlock(
                            le,
                            {
                              key: 0,
                              ref_key: 'submenuInstance',
                              ref: C,
                              items: e.unref(d).items,
                              adjustPosition: e.unref(d).adjustPosition,
                              maxWidth: e.unref(d).maxWidth || e.unref(L).defaultMaxWidth,
                              minWidth: e.unref(d).minWidth || e.unref(L).defaultMinWidth,
                              maxHeight: e.unref(d).maxHeight,
                              direction: e.unref(d).direction || e.unref(L).defaultDirection
                            },
                            { default: e.withCtx(() => [e.renderSlot(m.$slots, 'default')]), _: 3 },
                            8,
                            ['items', 'adjustPosition', 'maxWidth', 'minWidth', 'maxHeight', 'direction']
                          ))
                        : e.createCommentVNode('', !0)
                    ]),
                    _: 3
                  },
                  16
                ))
              : e.unref(b)
              ? (e.openBlock(),
                e.createBlock(
                  le,
                  {
                    key: 1,
                    ref_key: 'submenuInstance',
                    ref: C,
                    items: e.unref(d).items,
                    adjustPosition: e.unref(d).adjustPosition,
                    maxWidth: e.unref(d).maxWidth || e.unref(L).defaultMaxWidth,
                    minWidth: e.unref(d).minWidth || e.unref(L).defaultMinWidth,
                    maxHeight: e.unref(d).maxHeight,
                    direction: e.unref(d).direction || e.unref(L).defaultDirection
                  },
                  { default: e.withCtx(() => [e.renderSlot(m.$slots, 'default')]), _: 3 },
                  8,
                  ['items', 'adjustPosition', 'maxWidth', 'minWidth', 'maxHeight', 'direction']
                ))
              : e.createCommentVNode('', !0)
        )
      }
    }),
    bt = '',
    xe = e.defineComponent({
      __name: 'ContextMenu',
      props: { options: { type: Object, default: null }, show: { type: Boolean, default: !1 } },
      emits: ['update:show', 'close'],
      setup(t, { expose: o, emit: l }) {
        const u = l,
          h = t,
          { options: n, show: C } = e.toRefs(h),
          { isNew: d, container: b, eleId: f } = he(n.value),
          w = e.ref(null),
          R = e.useSlots()
        function E(k) {
          var M, y
          u('update:show', !1), u('close'), (y = (M = n.value).onClose) == null || y.call(M, k)
        }
        return (
          o({
            closeMenu: () => u('update:show', !1),
            isClosed: () => !C.value,
            getMenuRef: () => {
              var k
              return (k = w.value) == null ? void 0 : k.getMenuRef()
            },
            getMenuDimensions: () => {
              var k
              return ((k = w.value) == null ? void 0 : k.getMenuDimensions()) ?? { width: 0, height: 0 }
            }
          }),
          (k, M) => (
            e.openBlock(),
            e.createBlock(
              e.Teleport,
              { to: `#${e.unref(f)}` },
              [
                e.createVNode(
                  ye,
                  {
                    ref_key: 'menuRef',
                    ref: w,
                    options: e.unref(n),
                    show: e.unref(C),
                    container: e.unref(b),
                    isFullScreenContainer: !e.unref(d),
                    onClose: E
                  },
                  e.createSlots({ _: 2 }, [
                    e.renderList(e.unref(R), (y, _) => ({
                      name: _,
                      fn: e.withCtx(a => [e.renderSlot(k.$slots, _, e.normalizeProps(e.guardReactiveProps(a)))])
                    }))
                  ]),
                  1032,
                  ['options', 'show', 'container', 'isFullScreenContainer']
                )
              ],
              8,
              ['to']
            )
          )
        )
      }
    }),
    Me = e.defineComponent({
      name: 'ContextMenuGroup',
      props: {
        disabled: { type: Boolean, default: !1 },
        hidden: { type: Boolean, default: !1 },
        clickHandler: { type: Function, default: null },
        label: { type: String, default: '' },
        icon: { type: String, default: '' },
        iconFontClass: { type: String, default: 'iconfont' },
        checked: { type: Boolean, default: !1 },
        shortcut: { type: String, default: '' },
        svgIcon: { type: String, default: '' },
        svgProps: { type: Object, default: null },
        preserveIconWidth: { type: Boolean, default: !0 },
        showRightArrow: { type: Boolean, default: !1 },
        clickClose: { type: Boolean, default: !0 },
        adjustSubMenuPosition: { type: Boolean, default: void 0 },
        maxHeight: { type: [String, Number], default: 0 },
        maxWidth: { type: [String, Number], default: 0 },
        minWidth: { type: [String, Number], default: 0 }
      },
      setup(t, o) {
        const l = e.inject('globalOptions'),
          { adjustSubMenuPosition: u, maxWidth: h, minWidth: n, maxHeight: C } = e.toRefs(t),
          d = typeof u.value < 'u' ? u.value : l.value.adjustPosition,
          b = e.ref(),
          f = e.ref()
        return (
          o.expose({ getSubMenuRef: () => b.value, getMenuItemRef: () => f.value }),
          () =>
            e.h(
              oe,
              {
                ...t,
                ref: f,
                showRightArrow: !0,
                maxWidth: void 0,
                minWidth: void 0,
                maxHeight: void 0,
                adjustSubMenuPosition: void 0,
                hasChildren: typeof o.slots.default !== void 0
              },
              o.slots.default
                ? {
                    submenu: w =>
                      e.h(
                        le,
                        {
                          ref: b,
                          maxWidth: h.value,
                          minWidth: n.value,
                          maxHeight: C.value,
                          adjustPosition: d,
                          parentMenuItemContext: w.context
                        },
                        { default: o.slots.default }
                      ),
                    ...Ee(o.slots, 'default')
                  }
                : o.slots
            )
        )
      }
    })
  function rt(t, o, l, u) {
    const h = e.ref(!0),
      n = e.h(
        ye,
        {
          options: t,
          show: h.value,
          container: o,
          isFullScreenContainer: !l,
          onCloseAnimFinished: () => {
            e.render(null, o)
          },
          onClose: C => {
            var d
            ;(d = t.onClose) == null || d.call(t, C), (h.value = !1)
          }
        },
        u
      )
    return e.render(n, o), n.component
  }
  function Se(t, o) {
    const l = he(t)
    return rt(t, l.container, l.isNew, o).exposed
  }
  const se = {
      install(t) {
        ;(t.config.globalProperties.$contextmenu = Se),
          t.component('ContextMenu', xe),
          t.component('ContextMenuItem', oe),
          t.component('ContextMenuGroup', Me),
          t.component('ContextMenuSperator', G),
          t.component('ContextMenuSeparator', G),
          t.component('ContextSubMenu', le)
      },
      showContextMenu(t, o) {
        return Se(t, o)
      },
      isAnyContextMenuOpen() {
        return _e()
      },
      closeContextMenu: fe,
      transformMenuPosition: Re
    },
    st = {},
    at = {
      class: 'mx-menu-bar-icon-menu',
      viewBox: '0 0 1024 1024',
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '200',
      height: '200'
    },
    it = [
      e.createElementVNode(
        'path',
        {
          d: 'M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z'
        },
        null,
        -1
      ),
      e.createElementVNode(
        'path',
        {
          d: 'M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z'
        },
        null,
        -1
      ),
      e.createElementVNode(
        'path',
        {
          d: 'M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z'
        },
        null,
        -1
      )
    ]
  function ct(t, o) {
    return e.openBlock(), e.createElementBlock('svg', at, it)
  }
  const ut = ne(st, [['render', ct]]),
    dt = ['onClick', 'onMouseenter'],
    ft = e.defineComponent({
      __name: 'MenuBar',
      props: { options: { type: Object, default: null } },
      setup(t) {
        const o = t,
          l = e.ref(),
          u = e.ref(!1),
          h = e.ref([]),
          n = e.ref(null)
        function C() {
          u.value = !0
        }
        function d() {
          u.value = !1
        }
        e.onMounted(() => {
          h.value = o.options.items || []
        }),
          e.watch(
            () => o.options,
            () => {
              h.value = o.options.items || []
            }
          )
        let b = null,
          f = -1
        function w() {
          f < h.value.length - 1 ? f++ : (f = 0), k(f, h.value[f])
        }
        function R() {
          f > 0 ? f-- : (f = h.value.length - 1), k(f, h.value[f])
        }
        function E(a) {
          const c = o.options.barPopDirection ?? 'bl'
          let p = 0,
            S = 0
          return (
            c.startsWith('b')
              ? (S = U(a) + a.offsetHeight)
              : c.startsWith('t')
              ? (S = U(a))
              : (S = U(a) + a.offsetHeight / 2),
            c.endsWith('l')
              ? (p = X(a))
              : c.startsWith('r')
              ? (p = X(a) + a.offsetWidth)
              : (p = X(a) + a.offsetWidth / 2),
            { x: p, y: S }
          )
        }
        function k(a, c) {
          var S
          if (((f = a), !c.children)) return
          b && (b.closeMenu(), (b = null), (u.value = !0)), (n.value = c)
          const p = (S = l.value) == null ? void 0 : S.children[a]
          if (p) {
            const { x: P, y: m } = E(p)
            ;(b = se.showContextMenu({
              ...o.options,
              items: c.children,
              x: P,
              y: m,
              onKeyFocusMoveLeft() {
                R()
              },
              onKeyFocusMoveRight() {
                w()
              },
              onClose() {
                n.value == c && ((u.value = !1), (n.value = null)),
                  typeof c.onSubMenuClose == 'function' && c.onSubMenuClose(void 0)
              }
            })),
              b && typeof c.onSubMenuOpen == 'function' && c.onSubMenuOpen(void 0)
          }
        }
        function M() {
          f = 0
          const a = l.value
          if (a) {
            const { x: c, y: p } = E(a)
            b = se.showContextMenu({ ...o.options, x: c, y: p })
          }
        }
        function y(a, c) {
          c
            ? ((u.value = !0),
              k(a, c),
              c.onClick &&
                ((c.clickableWhenHasChildren === !0 && c.children && c.children.length > 0) ||
                  !c.children ||
                  c.children.length === 0) &&
                c.onClick())
            : M()
        }
        function _(a, c) {
          u.value && k(a, c)
        }
        return (a, c) => (
          e.openBlock(),
          e.createElementBlock(
            'div',
            {
              class: e.normalizeClass(['mx-menu-bar', t.options.theme ?? '', t.options.mini ? 'mini' : '']),
              onFocus: C,
              onBlur: d
            },
            [
              e.renderSlot(a.$slots, 'prefix'),
              t.options.mini
                ? (e.openBlock(),
                  e.createElementBlock(
                    'div',
                    { key: 0, ref_key: 'menuBarContent', ref: l, class: 'mx-menu-bar-content' },
                    [
                      e.createElementVNode(
                        'div',
                        { class: 'mx-menu-bar-item', onClick: c[0] || (c[0] = p => y(0, null)) },
                        [e.createVNode(ut)]
                      )
                    ],
                    512
                  ))
                : (e.openBlock(),
                  e.createElementBlock(
                    'div',
                    { key: 1, ref_key: 'menuBarContent', ref: l, class: 'mx-menu-bar-content' },
                    [
                      (e.openBlock(!0),
                      e.createElementBlock(
                        e.Fragment,
                        null,
                        e.renderList(
                          h.value,
                          (p, S) => (
                            e.openBlock(),
                            e.createElementBlock(
                              'div',
                              {
                                key: S,
                                class: e.normalizeClass(['mx-menu-bar-item', p == n.value ? 'active' : '']),
                                onClick: P => y(S, p),
                                onMouseenter: P => _(S, p)
                              },
                              e.toDisplayString(p.label),
                              43,
                              dt
                            )
                          )
                        ),
                        128
                      ))
                    ],
                    512
                  )),
              e.renderSlot(a.$slots, 'suffix')
            ],
            34
          )
        )
      }
    }),
    Mt = ''
  ;(V.ContextMenu = xe),
    (V.ContextMenuGroup = Me),
    (V.ContextMenuItem = oe),
    (V.ContextMenuSeparator = G),
    (V.MenuBar = ft),
    (V.default = se),
    Object.defineProperties(V, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } })
})
//# sourceMappingURL=vue3-context-menu.umd.js.map
