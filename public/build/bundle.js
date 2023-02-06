
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class GranttPeriod {
        constructor(periodName, periodStart, periodEnd) {
            this._periodName = periodName;
            this._periodStart = periodStart;
            this._periodEnd = periodEnd;
        }
        get periodName() {
            return this._periodName;
        }
        get periodStart() {
            return this._periodStart;
        }
        get periodEnd() {
            return this._periodEnd;
        }
    }

    class Process {
        constructor(name, arrivalTime, burstTime, priority) {
            this._finishedTime = null;
            this._responseTime = null;
            this._executionPeriods = [];
            this.name = name;
            this.arrivalTime = arrivalTime;
            this.burstTime = burstTime;
            this.priority = priority;
            this._remainingTime = burstTime;
            this._waitTime = 0;
            this._turnaroundTime = 0;
        }
        get finishedTime() {
            return this._finishedTime;
        }
        get waitTime() {
            return this._waitTime;
        }
        get turnaroundTime() {
            return this._turnaroundTime;
        }
        get responseTime() {
            return this._responseTime;
        }
        get endTime() {
            return Math.max(...this._executionPeriods.map((period) => period[1]));
        }
        get remainingTime() {
            return this._remainingTime;
        }
        get isDone() {
            return this._remainingTime <= 0;
        }
        execute(time, currentTime) {
            let lastExecutionPeriod = this._executionPeriods[this._executionPeriods.length - 1];
            this._remainingTime -= time;
            if (!!lastExecutionPeriod && lastExecutionPeriod[1] === currentTime) {
                lastExecutionPeriod[1] += time;
            }
            else
                this._executionPeriods.push([currentTime, currentTime + time]);
            if (this._responseTime === null)
                this._responseTime = currentTime - this.arrivalTime;
            if (this._remainingTime <= 0) {
                this._finishedTime = currentTime + time;
                this._waitTime =
                    this._finishedTime - this.arrivalTime - this.burstTime;
                this._turnaroundTime = this._finishedTime - this.arrivalTime;
            }
        }
        toGranttPeriods() {
            return this._executionPeriods.map(([start, end]) => new GranttPeriod(this.name, start, end));
        }
        clearCache() {
            this._executionPeriods = [];
        }
        reset() {
            this._remainingTime = this.burstTime;
            this._waitTime = 0;
            this._turnaroundTime = 0;
            this._finishedTime = null;
            this._responseTime = null;
        }
    }

    const DefaultCopyMapper = (values) => {
        return values.join(",");
    };

    /* src\components\Table.svelte generated by Svelte v3.49.0 */
    const file$5 = "src\\components\\Table.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (62:28) {#if column.copyable}
    function create_if_block_4(ctx) {
    	let button;
    	let i;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[8](/*column*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-copy");
    			add_location(i, file$5, 70, 36, 2332);
    			button.disabled = button_disabled_value = !/*column*/ ctx[15].copyable;
    			attr_dev(button, "class", "svelte-hmn8vv");
    			add_location(button, file$5, 62, 32, 1916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*columnsMapper*/ 2 && button_disabled_value !== (button_disabled_value = !/*column*/ ctx[15].copyable)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(62:28) {#if column.copyable}",
    		ctx
    	});

    	return block;
    }

    // (58:16) {#each columnsMapper as column}
    function create_each_block_3(ctx) {
    	let th;
    	let div;
    	let h5;
    	let t0_value = /*column*/ ctx[15].title + "";
    	let t0;
    	let t1;
    	let if_block = /*column*/ ctx[15].copyable && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(h5, file$5, 60, 28, 1808);
    			attr_dev(div, "class", "header svelte-hmn8vv");
    			add_location(div, file$5, 59, 24, 1758);
    			attr_dev(th, "class", "svelte-hmn8vv");
    			add_location(th, file$5, 58, 20, 1728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, div);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columnsMapper*/ 2 && t0_value !== (t0_value = /*column*/ ctx[15].title + "")) set_data_dev(t0, t0_value);

    			if (/*column*/ ctx[15].copyable) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(58:16) {#each columnsMapper as column}",
    		ctx
    	});

    	return block;
    }

    // (116:28) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*column*/ ctx[15].getter(/*item*/ ctx[18]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columnsMapper, calculatedProcesses*/ 6 && t_value !== (t_value = /*column*/ ctx[15].getter(/*item*/ ctx[18]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(116:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:28) {#if column.editable}
    function create_if_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*column*/ ctx[15].dataType === "number") return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(90:28) {#if column.editable}",
    		ctx
    	});

    	return block;
    }

    // (104:32) {:else}
    function create_else_block(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler_1(...args) {
    		return /*input_handler_1*/ ctx[10](/*column*/ ctx[15], /*rowIndex*/ ctx[20], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*column*/ ctx[15].getter(/*item*/ ctx[18]);
    			attr_dev(input, "class", "svelte-hmn8vv");
    			add_location(input, file$5, 104, 36, 3848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*columnsMapper, calculatedProcesses*/ 6 && input_value_value !== (input_value_value = /*column*/ ctx[15].getter(/*item*/ ctx[18])) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(104:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:32) {#if column.dataType === "number"}
    function create_if_block_3(ctx) {
    	let input;
    	let input_type_value;
    	let input_min_value;
    	let input_disabled_value;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[9](/*column*/ ctx[15], /*rowIndex*/ ctx[20], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", input_type_value = /*column*/ ctx[15].dataType);
    			attr_dev(input, "min", input_min_value = /*column*/ ctx[15].min ?? "unset");
    			input.disabled = input_disabled_value = !/*column*/ ctx[15].editable;
    			input.value = input_value_value = /*column*/ ctx[15].getter(/*item*/ ctx[18]);
    			attr_dev(input, "class", "svelte-hmn8vv");
    			add_location(input, file$5, 91, 36, 3108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*columnsMapper*/ 2 && input_type_value !== (input_type_value = /*column*/ ctx[15].dataType)) {
    				attr_dev(input, "type", input_type_value);
    			}

    			if (dirty & /*columnsMapper*/ 2 && input_min_value !== (input_min_value = /*column*/ ctx[15].min ?? "unset")) {
    				attr_dev(input, "min", input_min_value);
    			}

    			if (dirty & /*columnsMapper*/ 2 && input_disabled_value !== (input_disabled_value = !/*column*/ ctx[15].editable)) {
    				prop_dev(input, "disabled", input_disabled_value);
    			}

    			if (dirty & /*columnsMapper, calculatedProcesses*/ 6 && input_value_value !== (input_value_value = /*column*/ ctx[15].getter(/*item*/ ctx[18])) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(91:32) {#if column.dataType === \\\"number\\\"}",
    		ctx
    	});

    	return block;
    }

    // (88:20) {#each columnsMapper as column, columnIndex}
    function create_each_block_2$1(ctx) {
    	let td;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*column*/ ctx[15].editable) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if_block.c();
    			t = space();
    			attr_dev(td, "class", "svelte-hmn8vv");
    			add_location(td, file$5, 88, 24, 2947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if_block.m(td, null);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(88:20) {#each columnsMapper as column, columnIndex}",
    		ctx
    	});

    	return block;
    }

    // (123:20) {#if processes.length > 1}
    function create_if_block_1(ctx) {
    	let td;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[11](/*rowIndex*/ ctx[20], ...args);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-trash-can");
    			add_location(i, file$5, 128, 32, 4953);
    			attr_dev(button, "name", "delete");
    			attr_dev(button, "class", "svelte-hmn8vv");
    			add_location(button, file$5, 124, 28, 4763);
    			attr_dev(td, "class", "svelte-hmn8vv");
    			add_location(td, file$5, 123, 24, 4729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(123:20) {#if processes.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (86:12) {#each calculatedProcesses as item, rowIndex}
    function create_each_block_1$1(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*columnsMapper*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let if_block = /*processes*/ ctx[0].length > 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(tr, "class", "svelte-hmn8vv");
    			add_location(tr, file$5, 86, 16, 2851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			if (if_block) if_block.m(tr, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columnsMapper, calculatedProcesses, numberPostHandler, textPostHandler*/ 54) {
    				each_value_2 = /*columnsMapper*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (/*processes*/ ctx[0].length > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(tr, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(86:12) {#each calculatedProcesses as item, rowIndex}",
    		ctx
    	});

    	return block;
    }

    // (140:20) {#if column.avg}
    function create_if_block$2(ctx) {
    	let td;
    	let t0_value = average(/*calculatedProcesses*/ ctx[2], /*column*/ ctx[15].getter) + "";
    	let t0;
    	let t1;
    	let button;
    	let i;
    	let button_disabled_value;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[12](/*column*/ ctx[15], ...args);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			i = element("i");
    			t2 = space();
    			attr_dev(i, "class", "fa-solid fa-copy");
    			add_location(i, file$5, 152, 32, 5990);
    			button.disabled = button_disabled_value = !/*column*/ ctx[15].copyable;
    			attr_dev(button, "class", "svelte-hmn8vv");
    			add_location(button, file$5, 142, 28, 5495);
    			attr_dev(td, "class", "svelte-hmn8vv");
    			add_location(td, file$5, 140, 24, 5386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t0);
    			append_dev(td, t1);
    			append_dev(td, button);
    			append_dev(button, i);
    			append_dev(td, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*calculatedProcesses, columnsMapper*/ 6 && t0_value !== (t0_value = average(/*calculatedProcesses*/ ctx[2], /*column*/ ctx[15].getter) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*columnsMapper*/ 2 && button_disabled_value !== (button_disabled_value = !/*column*/ ctx[15].copyable)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(140:20) {#if column.avg}",
    		ctx
    	});

    	return block;
    }

    // (139:16) {#each columnsMapper as column}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*column*/ ctx[15].avg && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*column*/ ctx[15].avg) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(139:16) {#each columnsMapper as column}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr0;
    	let t0;
    	let button;
    	let i;
    	let t1;
    	let tbody;
    	let t2;
    	let tr1;
    	let td;
    	let t3;
    	let td_colspan_value;
    	let t4;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*columnsMapper*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_1 = /*calculatedProcesses*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*columnsMapper*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			i = element("i");
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			tr1 = element("tr");
    			td = element("td");
    			t3 = text("Average");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", "fa-solid fa-plus");
    			add_location(i, file$5, 80, 20, 2663);
    			attr_dev(button, "id", "add-row");
    			attr_dev(button, "class", "svelte-hmn8vv");
    			add_location(button, file$5, 76, 16, 2542);
    			attr_dev(tr0, "class", "svelte-hmn8vv");
    			add_location(tr0, file$5, 56, 12, 1653);
    			attr_dev(thead, "class", "svelte-hmn8vv");
    			add_location(thead, file$5, 55, 8, 1632);
    			attr_dev(td, "colspan", td_colspan_value = /*columnsMapper*/ ctx[1].filter(func).length);
    			attr_dev(td, "class", "svelte-hmn8vv");
    			add_location(td, file$5, 135, 16, 5165);
    			attr_dev(tr1, "class", "svelte-hmn8vv");
    			add_location(tr1, file$5, 134, 12, 5143);
    			attr_dev(tbody, "class", "svelte-hmn8vv");
    			add_location(tbody, file$5, 84, 8, 2767);
    			attr_dev(table, "class", "svelte-hmn8vv");
    			add_location(table, file$5, 54, 4, 1615);
    			attr_dev(div, "class", "component svelte-hmn8vv");
    			add_location(div, file$5, 53, 0, 1586);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(tr0, null);
    			}

    			append_dev(tr0, t0);
    			append_dev(tr0, button);
    			append_dev(button, i);
    			append_dev(table, t1);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			append_dev(tbody, t2);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td);
    			append_dev(td, t3);
    			append_dev(tr1, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addRow*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*columnsMapper, copyRow*/ 10) {
    				each_value_3 = /*columnsMapper*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(tr0, t0);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*deleteRow, processes, columnsMapper, calculatedProcesses, numberPostHandler, textPostHandler*/ 119) {
    				each_value_1 = /*calculatedProcesses*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, t2);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*columnsMapper*/ 2 && td_colspan_value !== (td_colspan_value = /*columnsMapper*/ ctx[1].filter(func).length)) {
    				attr_dev(td, "colspan", td_colspan_value);
    			}

    			if (dirty & /*columnsMapper, copy, average, calculatedProcesses*/ 6) {
    				each_value = /*columnsMapper*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function copy$1(value) {
    	navigator.clipboard.writeText(value);
    }

    function average(processes, getter) {
    	const sum = processes.map(v => getter(v)).reduce((acc, v) => acc + v, 0);
    	return sum / processes.length;
    }

    const func = c => c.avg;

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	const dispatch = createEventDispatcher();
    	let nameIndex = 6;
    	let { columnsMapper = [] } = $$props;
    	let { processes = [] } = $$props;
    	let { calculatedProcesses } = $$props;

    	function copyRow(value, copyMapper) {
    		const values = processes.map(p => value(p));

    		const clipboard = copyMapper
    		? copyMapper(values)
    		: DefaultCopyMapper(values);

    		copy$1(clipboard);
    	}

    	function numberPostHandler(event, setter, index) {
    		const input = event.target;
    		const value = Number(input.value);
    		input.value = value.toString();
    		setter(processes[index], value);
    		dispatch("change", { data: processes });
    	}

    	function textPostHandler(event, setter, index) {
    		const input = event.target;
    		const value = input.value.slice(0, 10);
    		input.value = value;
    		setter(processes[index], value);
    		dispatch("change", { data: processes });
    	}

    	function deleteRow(index) {
    		$$invalidate(0, processes = processes.filter((_, i) => i !== index));
    	}

    	function addRow() {
    		if (processes.length === 10) return;
    		$$invalidate(0, processes = [...processes, new Process(`P-${nameIndex}`, 0, 1, 0)]);
    		nameIndex += 1;
    	}

    	const writable_props = ['columnsMapper', 'processes', 'calculatedProcesses'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (column, e) => copyRow(column.getter, column.copyMapper);
    	const input_handler = (column, rowIndex, e) => numberPostHandler(e, column.setter, rowIndex);
    	const input_handler_1 = (column, rowIndex, e) => textPostHandler(e, column.setter, rowIndex);
    	const click_handler_1 = (rowIndex, e) => deleteRow(rowIndex);
    	const click_handler_2 = (column, e) => copy$1(average(calculatedProcesses, column.getter).toString());

    	$$self.$$set = $$props => {
    		if ('columnsMapper' in $$props) $$invalidate(1, columnsMapper = $$props.columnsMapper);
    		if ('processes' in $$props) $$invalidate(0, processes = $$props.processes);
    		if ('calculatedProcesses' in $$props) $$invalidate(2, calculatedProcesses = $$props.calculatedProcesses);
    	};

    	$$self.$capture_state = () => ({
    		Process,
    		createEventDispatcher,
    		DefaultCopyMapper,
    		dispatch,
    		nameIndex,
    		columnsMapper,
    		processes,
    		calculatedProcesses,
    		copy: copy$1,
    		copyRow,
    		numberPostHandler,
    		textPostHandler,
    		average,
    		deleteRow,
    		addRow
    	});

    	$$self.$inject_state = $$props => {
    		if ('nameIndex' in $$props) nameIndex = $$props.nameIndex;
    		if ('columnsMapper' in $$props) $$invalidate(1, columnsMapper = $$props.columnsMapper);
    		if ('processes' in $$props) $$invalidate(0, processes = $$props.processes);
    		if ('calculatedProcesses' in $$props) $$invalidate(2, calculatedProcesses = $$props.calculatedProcesses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		processes,
    		columnsMapper,
    		calculatedProcesses,
    		copyRow,
    		numberPostHandler,
    		textPostHandler,
    		deleteRow,
    		addRow,
    		click_handler,
    		input_handler,
    		input_handler_1,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			columnsMapper: 1,
    			processes: 0,
    			calculatedProcesses: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*calculatedProcesses*/ ctx[2] === undefined && !('calculatedProcesses' in props)) {
    			console.warn("<Table> was created without expected prop 'calculatedProcesses'");
    		}
    	}

    	get columnsMapper() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnsMapper(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get processes() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set processes(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get calculatedProcesses() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set calculatedProcesses(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Grantt.svelte generated by Svelte v3.49.0 */

    const file$4 = "src\\components\\Grantt.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (31:16) {#if run.periodName === name}
    function create_if_block$1(ctx) {
    	let div;
    	let t_value = /*run*/ ctx[12].periodName + "";
    	let t;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "grantt svelte-o5p54z");

    			attr_dev(div, "style", div_style_value = `
                                --start: ${/*run*/ ctx[12].periodStart + 2};
                                --end: ${/*run*/ ctx[12].periodEnd + 2};
                                --rows: ${/*index*/ ctx[9] + 2};

                                --color: ${/*getColor*/ ctx[5](/*index*/ ctx[9])};
                                --shadow-color: ${`${/*getColor*/ ctx[5](/*index*/ ctx[9])}4f`};
                            `);

    			add_location(div, file$4, 31, 20, 894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*runs*/ 1 && t_value !== (t_value = /*run*/ ctx[12].periodName + "")) set_data_dev(t, t_value);

    			if (dirty & /*runs*/ 1 && div_style_value !== (div_style_value = `
                                --start: ${/*run*/ ctx[12].periodStart + 2};
                                --end: ${/*run*/ ctx[12].periodEnd + 2};
                                --rows: ${/*index*/ ctx[9] + 2};

                                --color: ${/*getColor*/ ctx[5](/*index*/ ctx[9])};
                                --shadow-color: ${`${/*getColor*/ ctx[5](/*index*/ ctx[9])}4f`};
                            `)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:16) {#if run.periodName === name}",
    		ctx
    	});

    	return block;
    }

    // (30:12) {#each runs as run}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = /*run*/ ctx[12].periodName === /*name*/ ctx[10] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*run*/ ctx[12].periodName === /*name*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(30:12) {#each runs as run}",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#each processesName as name, index}
    function create_each_block_1(ctx) {
    	let div;
    	let t0_value = /*name*/ ctx[10] + "";
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let each_value_2 = /*runs*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(div, "class", "title svelte-o5p54z");

    			attr_dev(div, "style", `
                --rows: ${/*index*/ ctx[9] + 2}
            `);

    			add_location(div, file$4, 21, 12, 618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*processesName*/ 2 && t0_value !== (t0_value = /*name*/ ctx[10] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*runs, getColor, processesName*/ 35) {
    				each_value_2 = /*runs*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(21:8) {#each processesName as name, index}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each Array(cols) as _, index}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*index*/ ctx[9]);

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*periodStamps*/ ctx[2].includes(/*index*/ ctx[9])
    			? "time stamp"
    			: "time") + " svelte-o5p54z"));

    			attr_dev(div, "style", `
                --cols: ${/*index*/ ctx[9] + 2};
                `);

    			add_location(div, file$4, 48, 12, 1536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*periodStamps*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(/*periodStamps*/ ctx[2].includes(/*index*/ ctx[9])
    			? "time stamp"
    			: "time") + " svelte-o5p54z"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(48:8) {#each Array(cols) as _, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let div0_style_value;
    	let div1_style_value;
    	let each_value_1 = /*processesName*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = Array(/*cols*/ ctx[4]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			t2 = text(/*cols*/ ctx[4]);
    			attr_dev(div0, "class", "time last stamp svelte-o5p54z");

    			attr_dev(div0, "style", div0_style_value = `
                --cols: ${/*cols*/ ctx[4] + 1};
            `);

    			add_location(div0, file$4, 57, 8, 1790);
    			attr_dev(div1, "class", "table svelte-o5p54z");

    			attr_dev(div1, "style", div1_style_value = `
            --cols: ${/*cols*/ ctx[4]};
            --rows: ${/*rows*/ ctx[3]}
        `);

    			add_location(div1, file$4, 13, 4, 435);
    			attr_dev(div2, "class", "component svelte-o5p54z");
    			add_location(div2, file$4, 12, 0, 406);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div1, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*runs, getColor, processesName*/ 35) {
    				each_value_1 = /*processesName*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*periodStamps, cols*/ 20) {
    				each_value = Array(/*cols*/ ctx[4]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*cols*/ 16) set_data_dev(t2, /*cols*/ ctx[4]);

    			if (dirty & /*cols*/ 16 && div0_style_value !== (div0_style_value = `
                --cols: ${/*cols*/ ctx[4] + 1};
            `)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*cols, rows*/ 24 && div1_style_value !== (div1_style_value = `
            --cols: ${/*cols*/ ctx[4]};
            --rows: ${/*rows*/ ctx[3]}
        `)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let processesName;
    	let cols;
    	let rows;
    	let periodStamps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grantt', slots, []);
    	const Colors = ["#5800FF"];
    	let { runs = [] } = $$props;

    	function getColor(index) {
    		return Colors[index % Colors.length];
    	}

    	const writable_props = ['runs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grantt> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('runs' in $$props) $$invalidate(0, runs = $$props.runs);
    	};

    	$$self.$capture_state = () => ({
    		Colors,
    		runs,
    		getColor,
    		periodStamps,
    		processesName,
    		rows,
    		cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('runs' in $$props) $$invalidate(0, runs = $$props.runs);
    		if ('periodStamps' in $$props) $$invalidate(2, periodStamps = $$props.periodStamps);
    		if ('processesName' in $$props) $$invalidate(1, processesName = $$props.processesName);
    		if ('rows' in $$props) $$invalidate(3, rows = $$props.rows);
    		if ('cols' in $$props) $$invalidate(4, cols = $$props.cols);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*runs*/ 1) {
    			$$invalidate(1, processesName = [...new Set(runs.map(run => run.periodName))]);
    		}

    		if ($$self.$$.dirty & /*runs*/ 1) {
    			$$invalidate(4, cols = Math.max(...runs.map(run => run.periodEnd)));
    		}

    		if ($$self.$$.dirty & /*processesName*/ 2) {
    			$$invalidate(3, rows = processesName.length);
    		}

    		if ($$self.$$.dirty & /*runs*/ 1) {
    			// Flat map of all periods
    			$$invalidate(2, periodStamps = [0, ...runs.map(run => run.periodEnd)]);
    		}
    	};

    	return [runs, processesName, periodStamps, rows, cols, getColor];
    }

    class Grantt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { runs: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grantt",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get runs() {
    		throw new Error("<Grantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set runs(value) {
    		throw new Error("<Grantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ClearProcessesCache(processes) {
        // Clear all cache
        processes.forEach((process) => process.clearCache());
        processes.forEach((process) => process.reset());
    }
    function ResponseRatio(process, time) {
        return (time - process.arrivalTime + process.burstTime) / process.burstTime;
    }
    // Sortest job first (SJF) ** Non-Preemptive
    /**
     * @param processes
     * @returns
     * @description
     * Shortest job next (SJN), also known as shortest job first (SJF) or shortest process next (SPN), is a scheduling policy that selects for execution the waiting process with the smallest execution time.[1] SJN is a non-preemptive algorithm. Shortest remaining time is a preemptive variant of SJN.
     * https://en.wikipedia.org/wiki/Shortest_job_next
     * */
    function SortestJobFirst(processes, options) {
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (arrivedProcessesAtCurrentTime.length > 0) {
            // Execute first process in arrived processes list and remove it from list
            let firstProcess = arrivedProcessesAtCurrentTime.shift();
            firstProcess.execute(firstProcess.burstTime, time);
            time += firstProcess.burstTime;
            // Add finished process to list
            finishedProcesses.push(firstProcess);
            // Get all processes that arrived at the current time and add them to arrived processes list then remove them from processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            // Sort by burst time
            arrivedProcessesAtCurrentTime.sort((a, b) => {
                return a.burstTime - b.burstTime;
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }
    // ShortestRemainingTimeFirst (SRTF) ** Preemptive version of shortest job next scheduling algorithm.
    /**
     * @param processes
     * @returns
     * @description
     Shortest remaining time, also known as shortest remaining time first (SRTF), is a scheduling method that is a preemptive version of shortest job next scheduling. In this scheduling algorithm, the process with the smallest amount of time remaining until completion is selected to execute. Since the currently executing process is the one with the shortest amount of time remaining by definition, and since that time should only reduce as execution progresses, the process will either run until it completes or get preempted if a new process is added that requires a smaller amount of time.
     https://en.wikipedia.org/wiki/Shortest_remaining_time
     **/
    function ShortestRemainingTimeFirst(processes, options) {
        var _a, _b;
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
            // get first process in arrived processes list
            let firstProcess = arrivedProcessesAtCurrentTime[0];
            // get time from now to next process arrival time
            let nextProcessArrivalTime = (_b = (_a = processes[0]) === null || _a === void 0 ? void 0 : _a.arrivalTime) !== null && _b !== void 0 ? _b : Infinity;
            let timeToNextProcessArrivalTime = nextProcessArrivalTime - time;
            // execute process for the minimum time between burst time and time to next process arrival time
            let timeToExecute = Math.min(firstProcess.remainingTime, timeToNextProcessArrivalTime);
            firstProcess.execute(timeToExecute, time);
            time += timeToExecute;
            // add all arrived processes to arrived processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            // move all finished processes from arrived processes list to finished processes list
            arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter((process) => {
                if (process.isDone) {
                    finishedProcesses.push(process);
                    return false;
                }
                return true;
            });
            // sort arrived processes by remaining time
            arrivedProcessesAtCurrentTime.sort((a, b) => {
                return a.remainingTime - b.remainingTime;
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }
    // First-Come, First-Served
    /**
     * @param processes
     * @returns
     **/
    function FirstComeFirstServed(processes, options) {
        // Clear all cache
        ClearProcessesCache(processes);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        let time = 0;
        processes.forEach((process) => {
            process.execute(process.burstTime, time);
            time += process.burstTime;
        });
        return processes;
    }
    // Priority Scheduling
    /**
     * @param processes
     * @returns
     **/
    function PreemptivePriorityScheduling(processes, options) {
        var _a, _b;
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
            // get first process in arrived processes list
            let firstProcess = arrivedProcessesAtCurrentTime[0];
            // get time from now to next process arrival time
            let nextProcessArrivalTime = (_b = (_a = processes[0]) === null || _a === void 0 ? void 0 : _a.arrivalTime) !== null && _b !== void 0 ? _b : Infinity;
            let timeToNextProcessArrivalTime = nextProcessArrivalTime - time;
            // execute process for the minimum time between burst time and time to next process arrival time
            let timeToExecute = Math.min(firstProcess.remainingTime, timeToNextProcessArrivalTime);
            firstProcess.execute(timeToExecute, time);
            time += timeToExecute;
            // add all arrived processes to arrived processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            // move all finished processes from arrived processes list to finished processes list
            arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter((process) => {
                if (process.isDone) {
                    finishedProcesses.push(process);
                    return false;
                }
                return true;
            });
            // sort arrived processes by remaining time
            arrivedProcessesAtCurrentTime.sort((a, b) => {
                return a.priority - b.priority;
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }
    // Priority Scheduling
    /**
     * @param processes
     * @returns
     **/
    function NonPreemptivePriorityScheduling(processes, options) {
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
            // get first process in arrived processes list
            let firstProcess = arrivedProcessesAtCurrentTime[0];
            // execute process for the minimum time between burst time and time to next process arrival time
            let timeToExecute = firstProcess.burstTime;
            firstProcess.execute(timeToExecute, time);
            time += timeToExecute;
            // add all arrived processes to arrived processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            // move all finished processes from arrived processes list to finished processes list
            arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter((process) => {
                if (process.isDone) {
                    finishedProcesses.push(process);
                    return false;
                }
                return true;
            });
            // sort arrived processes by remaining time
            arrivedProcessesAtCurrentTime.sort((a, b) => {
                return a.priority - b.priority;
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }
    // Round Robin
    function RoundRobin(processes, options) {
        var _a;
        const quantumnTime = (_a = options === null || options === void 0 ? void 0 : options.quantumnTime) !== null && _a !== void 0 ? _a : 1;
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
            // get first process in arrived processes list
            let firstProcess = arrivedProcessesAtCurrentTime.shift();
            // execute process for the minimum time between burst time and time to next process arrival time
            let timeToExecute = Math.min(firstProcess.remainingTime, quantumnTime);
            firstProcess.execute(timeToExecute, time);
            time += timeToExecute;
            // add all arrived processes to arrived processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            arrivedProcessesAtCurrentTime.push(firstProcess);
            // move all finished processes from arrived processes list to finished processes list
            arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter((process) => {
                if (process.isDone) {
                    finishedProcesses.push(process);
                    return false;
                }
                return true;
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }
    // Highest Response Ratio Next
    function HighestResponseRatioNext(processes, options) {
        // Clear all cache
        ClearProcessesCache(processes);
        // Get name order of processes
        const namesOrder = processes.map((p) => p.name);
        // Sort processes by arrival time
        processes.sort((a, b) => {
            return a.arrivalTime - b.arrivalTime;
        });
        // Execute processes
        let time = processes[0].arrivalTime;
        let finishedProcesses = [];
        let arrivedProcessesAtCurrentTime = [];
        // Add first process to arrived processes
        arrivedProcessesAtCurrentTime.push(processes.shift());
        while (processes.length > 0 || arrivedProcessesAtCurrentTime.length > 0) {
            // get first process in arrived processes list
            let firstProcess = arrivedProcessesAtCurrentTime[0];
            // execute process for the minimum time between burst time and time to next process arrival time
            let timeToExecute = firstProcess.burstTime;
            firstProcess.execute(timeToExecute, time);
            time += timeToExecute;
            // add all arrived processes to arrived processes list
            if (processes.length > 0) {
                let arrivedProcesses = processes.filter((process) => {
                    return process.arrivalTime <= time;
                });
                arrivedProcessesAtCurrentTime =
                    arrivedProcessesAtCurrentTime.concat(arrivedProcesses);
                processes = processes.filter((process) => {
                    return process.arrivalTime > time;
                });
            }
            // move all finished processes from arrived processes list to finished processes list
            arrivedProcessesAtCurrentTime = arrivedProcessesAtCurrentTime.filter((process) => {
                if (process.isDone) {
                    finishedProcesses.push(process);
                    return false;
                }
                return true;
            });
            // sort arrived processes by RR
            arrivedProcessesAtCurrentTime.sort((a, b) => {
                return ResponseRatio(b, time) - ResponseRatio(a, time);
            });
        }
        // Order finished processes by nameOrder
        finishedProcesses.sort((a, b) => {
            return namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name);
        });
        return finishedProcesses;
    }

    var Scheduler = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SortestJobFirst: SortestJobFirst,
        ShortestRemainingTimeFirst: ShortestRemainingTimeFirst,
        FirstComeFirstServed: FirstComeFirstServed,
        PreemptivePriorityScheduling: PreemptivePriorityScheduling,
        NonPreemptivePriorityScheduling: NonPreemptivePriorityScheduling,
        RoundRobin: RoundRobin,
        HighestResponseRatioNext: HighestResponseRatioNext
    });

    /* src\components\Algorithms.svelte generated by Svelte v3.49.0 */

    const file$3 = "src\\components\\Algorithms.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (50:20) {#if algorithm.shorthand}
    function create_if_block(ctx) {
    	let b;
    	let t0_value = /*algorithm*/ ctx[4].shorthand + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = text(" -");
    			attr_dev(b, "class", "svelte-1a8g062");
    			add_location(b, file$3, 50, 24, 1748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(50:20) {#if algorithm.shorthand}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#each Algorithms as algorithm, index}
    function create_each_block(ctx) {
    	let li;
    	let button;
    	let t0;
    	let t1_value = /*algorithm*/ ctx[4].name + "";
    	let t1;
    	let button_class_value;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*algorithm*/ ctx[4].shorthand && create_if_block(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[3](/*index*/ ctx[6], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			button.disabled = /*algorithm*/ ctx[4].disabled ?? false;

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*selectedIndex*/ ctx[0] === /*index*/ ctx[6]
    			? "item selected"
    			: "item") + " svelte-1a8g062"));

    			add_location(button, file$3, 41, 16, 1317);
    			add_location(li, file$3, 40, 12, 1295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (/*algorithm*/ ctx[4].shorthand) if_block.p(ctx, dirty);

    			if (dirty & /*selectedIndex*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*selectedIndex*/ ctx[0] === /*index*/ ctx[6]
    			? "item selected"
    			: "item") + " svelte-1a8g062"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(40:8) {#each Algorithms as algorithm, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let ul;
    	let each_value = /*Algorithms*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1a8g062");
    			add_location(ul, file$3, 38, 4, 1229);
    			attr_dev(div, "class", "algo");
    			add_location(div, file$3, 37, 0, 1205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Algorithms, selectedIndex, dispatch*/ 7) {
    				each_value = /*Algorithms*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Algorithms', slots, []);

    	const Algorithms = [
    		{
    			name: "Shortest Job First",
    			shorthand: "SJF",
    			scheduler: SortestJobFirst
    		},
    		{
    			name: "Shortest Remaining Time First ",
    			shorthand: "SRTF",
    			scheduler: ShortestRemainingTimeFirst
    		},
    		{
    			name: "First-Come, First-Served ",
    			shorthand: "FCFS",
    			scheduler: FirstComeFirstServed
    		},
    		{
    			name: "Preemptive Priority Scheduling",
    			scheduler: PreemptivePriorityScheduling
    		},
    		{
    			name: "Non-Preemptive Priority Scheduling",
    			scheduler: NonPreemptivePriorityScheduling
    		},
    		{
    			name: "Round-Robin ",
    			shorthand: "RR",
    			scheduler: RoundRobin
    		},
    		{
    			name: "Highest Response Ratio Next ",
    			shorthand: "HRRN",
    			scheduler: HighestResponseRatioNext
    		}
    	];

    	let selectedIndex = 0;
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Algorithms> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (index, e) => {
    		$$invalidate(0, selectedIndex = index);
    		dispatch("change", Algorithms[selectedIndex].scheduler);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		FirstComeFirstServed,
    		HighestResponseRatioNext,
    		NonPreemptivePriorityScheduling,
    		PreemptivePriorityScheduling,
    		RoundRobin,
    		ShortestRemainingTimeFirst,
    		SortestJobFirst,
    		Algorithms,
    		selectedIndex,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedIndex' in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedIndex, Algorithms, dispatch, click_handler];
    }

    class Algorithms_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Algorithms_1",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Metrics.svelte generated by Svelte v3.49.0 */

    const file$2 = "src\\components\\Metrics.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Quantum Time";
    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", "svelte-41teyp");
    			add_location(div0, file$2, 5, 8, 100);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "id", "quantumn-time");
    			attr_dev(input, "class", "svelte-41teyp");
    			add_location(input, file$2, 6, 8, 133);
    			attr_dev(div1, "class", "settings svelte-41teyp");
    			add_location(div1, file$2, 4, 4, 68);
    			add_location(div2, file$2, 3, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*quantumnTime*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*quantumnTime*/ 1 && to_number(input.value) !== /*quantumnTime*/ ctx[0]) {
    				set_input_value(input, /*quantumnTime*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Metrics', slots, []);
    	let { quantumnTime } = $$props;
    	const writable_props = ['quantumnTime'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Metrics> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		quantumnTime = to_number(this.value);
    		$$invalidate(0, quantumnTime);
    	}

    	$$self.$$set = $$props => {
    		if ('quantumnTime' in $$props) $$invalidate(0, quantumnTime = $$props.quantumnTime);
    	};

    	$$self.$capture_state = () => ({ quantumnTime });

    	$$self.$inject_state = $$props => {
    		if ('quantumnTime' in $$props) $$invalidate(0, quantumnTime = $$props.quantumnTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [quantumnTime, input_input_handler];
    }

    class Metrics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { quantumnTime: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Metrics",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quantumnTime*/ ctx[0] === undefined && !('quantumnTime' in props)) {
    			console.warn("<Metrics> was created without expected prop 'quantumnTime'");
    		}
    	}

    	get quantumnTime() {
    		throw new Error("<Metrics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quantumnTime(value) {
    		throw new Error("<Metrics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Donate.svelte generated by Svelte v3.49.0 */

    const { window: window_1 } = globals;
    const file$1 = "src\\components\\Donate.svelte";

    function create_fragment$1(ctx) {
    	let div0;
    	let button0;
    	let i0;
    	let t0;
    	let p0;
    	let t2;
    	let button1;
    	let i1;
    	let t3;
    	let p1;
    	let t5;
    	let div6;
    	let div5;
    	let p2;
    	let t7;
    	let button2;
    	let i2;
    	let t8;
    	let div2;
    	let div1;
    	let b0;
    	let t10;
    	let p3;
    	let t12;
    	let p4;
    	let t14;
    	let button3;
    	let i3;
    	let t15;
    	let div4;
    	let div3;
    	let b1;
    	let t17;
    	let p5;
    	let t19;
    	let p6;
    	let t21;
    	let button4;
    	let i4;
    	let div6_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Source";
    			t2 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Hảo tâm";
    			t5 = space();
    			div6 = element("div");
    			div5 = element("div");
    			p2 = element("p");
    			p2.textContent = "Hảo tâm";
    			t7 = space();
    			button2 = element("button");
    			i2 = element("i");
    			t8 = space();
    			div2 = element("div");
    			div1 = element("div");
    			b0 = element("b");
    			b0.textContent = "Momo";
    			t10 = space();
    			p3 = element("p");
    			p3.textContent = "0946 378 852";
    			t12 = space();
    			p4 = element("p");
    			p4.textContent = "Văn Viết Hiếu Anh";
    			t14 = space();
    			button3 = element("button");
    			i3 = element("i");
    			t15 = space();
    			div4 = element("div");
    			div3 = element("div");
    			b1 = element("b");
    			b1.textContent = "TP Bank";
    			t17 = space();
    			p5 = element("p");
    			p5.textContent = "0323 731 6401";
    			t19 = space();
    			p6 = element("p");
    			p6.textContent = "Văn Viết Hiếu Anh";
    			t21 = space();
    			button4 = element("button");
    			i4 = element("i");
    			attr_dev(i0, "class", "fa-brands fa-github-alt");
    			add_location(i0, file$1, 14, 8, 337);
    			add_location(p0, file$1, 15, 8, 384);
    			attr_dev(button0, "id", "github");
    			attr_dev(button0, "class", "svelte-1o5yp31");
    			add_location(button0, file$1, 7, 4, 150);
    			attr_dev(i1, "class", "fa-solid fa-heart");
    			add_location(i1, file$1, 23, 8, 533);
    			add_location(p1, file$1, 24, 8, 574);
    			attr_dev(button1, "id", "donate");
    			attr_dev(button1, "class", "svelte-1o5yp31");
    			add_location(button1, file$1, 17, 4, 418);
    			attr_dev(div0, "class", "main svelte-1o5yp31");
    			add_location(div0, file$1, 6, 0, 126);
    			attr_dev(p2, "id", "title");
    			attr_dev(p2, "class", "svelte-1o5yp31");
    			add_location(p2, file$1, 29, 8, 708);
    			attr_dev(i2, "class", "fa-solid fa-xmark");
    			add_location(i2, file$1, 37, 12, 915);
    			attr_dev(button2, "id", "close");
    			attr_dev(button2, "class", "icon-button svelte-1o5yp31");
    			add_location(button2, file$1, 30, 8, 743);
    			attr_dev(b0, "class", "svelte-1o5yp31");
    			add_location(b0, file$1, 41, 16, 1053);
    			add_location(p3, file$1, 42, 16, 1082);
    			attr_dev(div1, "class", "numbers svelte-1o5yp31");
    			add_location(div1, file$1, 40, 12, 1014);
    			add_location(p4, file$1, 44, 12, 1135);
    			attr_dev(div2, "class", "momo method svelte-1o5yp31");
    			add_location(div2, file$1, 39, 8, 975);
    			attr_dev(i3, "class", "fa-solid fa-copy");
    			add_location(i3, file$1, 50, 12, 1299);
    			attr_dev(button3, "class", "icon-button svelte-1o5yp31");
    			add_location(button3, file$1, 46, 8, 1185);
    			attr_dev(b1, "class", "svelte-1o5yp31");
    			add_location(b1, file$1, 54, 16, 1436);
    			add_location(p5, file$1, 55, 16, 1468);
    			attr_dev(div3, "class", "numbers svelte-1o5yp31");
    			add_location(div3, file$1, 53, 12, 1397);
    			add_location(p6, file$1, 57, 12, 1522);
    			attr_dev(div4, "class", "momo method svelte-1o5yp31");
    			add_location(div4, file$1, 52, 8, 1358);
    			attr_dev(i4, "class", "fa-solid fa-copy");
    			add_location(i4, file$1, 63, 12, 1687);
    			attr_dev(button4, "class", "icon-button svelte-1o5yp31");
    			add_location(button4, file$1, 59, 8, 1572);
    			attr_dev(div5, "class", "donate-dialog svelte-1o5yp31");
    			add_location(div5, file$1, 28, 4, 671);
    			attr_dev(div6, "class", div6_class_value = "" + (null_to_empty(/*dialogOpen*/ ctx[0] ? "donate" : "donate close") + " svelte-1o5yp31"));
    			add_location(div6, file$1, 27, 0, 613);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(button0, t0);
    			append_dev(button0, p0);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(button1, i1);
    			append_dev(button1, t3);
    			append_dev(button1, p1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, p2);
    			append_dev(div5, t7);
    			append_dev(div5, button2);
    			append_dev(button2, i2);
    			append_dev(div5, t8);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, b0);
    			append_dev(div1, t10);
    			append_dev(div1, p3);
    			append_dev(div2, t12);
    			append_dev(div2, p4);
    			append_dev(div5, t14);
    			append_dev(div5, button3);
    			append_dev(button3, i3);
    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, b1);
    			append_dev(div3, t17);
    			append_dev(div3, p5);
    			append_dev(div4, t19);
    			append_dev(div4, p6);
    			append_dev(div5, t21);
    			append_dev(div5, button4);
    			append_dev(button4, i4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*keydown_handler*/ ctx[1], false, false, false),
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[4], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[5], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dialogOpen*/ 1 && div6_class_value !== (div6_class_value = "" + (null_to_empty(/*dialogOpen*/ ctx[0] ? "donate" : "donate close") + " svelte-1o5yp31"))) {
    				attr_dev(div6, "class", div6_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function copy(value) {
    	navigator.clipboard.writeText(value);
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Donate', slots, []);
    	let dialogOpen = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Donate> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = event => {
    		if (event.key === "Escape") {
    			$$invalidate(0, dialogOpen = false);
    		}
    	};

    	const click_handler = () => window.open("https://github.com/vanviethieuanh/scheduling-algorithms");

    	const click_handler_1 = () => {
    		$$invalidate(0, dialogOpen = true);
    	};

    	const click_handler_2 = () => {
    		$$invalidate(0, dialogOpen = false);
    	};

    	const click_handler_3 = () => copy("0946378852");
    	const click_handler_4 = () => copy("03237316401");
    	$$self.$capture_state = () => ({ dialogOpen, copy });

    	$$self.$inject_state = $$props => {
    		if ('dialogOpen' in $$props) $$invalidate(0, dialogOpen = $$props.dialogOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dialogOpen,
    		keydown_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Donate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Donate",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div3;
    	let grantt;
    	let t0;
    	let div1;
    	let algorithms;
    	let t1;
    	let div0;
    	let t2;
    	let metrics;
    	let updating_quantumnTime;
    	let t3;
    	let div2;
    	let table;
    	let updating_processes;
    	let t4;
    	let donate;
    	let current;

    	grantt = new Grantt({
    			props: { runs: /*runs*/ ctx[4] },
    			$$inline: true
    		});

    	algorithms = new Algorithms_1({ $$inline: true });
    	algorithms.$on("change", /*change_handler*/ ctx[7]);

    	function metrics_quantumnTime_binding(value) {
    		/*metrics_quantumnTime_binding*/ ctx[8](value);
    	}

    	let metrics_props = {};

    	if (/*quantumnTime*/ ctx[2] !== void 0) {
    		metrics_props.quantumnTime = /*quantumnTime*/ ctx[2];
    	}

    	metrics = new Metrics({ props: metrics_props, $$inline: true });
    	binding_callbacks.push(() => bind(metrics, 'quantumnTime', metrics_quantumnTime_binding));

    	function table_processes_binding(value) {
    		/*table_processes_binding*/ ctx[9](value);
    	}

    	let table_props = {
    		calculatedProcesses: /*result*/ ctx[3],
    		columnsMapper: /*inputColumnsMapper*/ ctx[5]
    	};

    	if (/*inputProcesses*/ ctx[0] !== void 0) {
    		table_props.processes = /*inputProcesses*/ ctx[0];
    	}

    	table = new Table({ props: table_props, $$inline: true });
    	binding_callbacks.push(() => bind(table, 'processes', table_processes_binding));
    	table.$on("change", /*updateInput*/ ctx[6]);
    	donate = new Donate({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div3 = element("div");
    			create_component(grantt.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(algorithms.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			create_component(metrics.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			create_component(table.$$.fragment);
    			t4 = space();
    			create_component(donate.$$.fragment);
    			attr_dev(div0, "class", "divider");
    			add_location(div0, file, 117, 12, 3142);
    			attr_dev(div1, "class", "options");
    			add_location(div1, file, 111, 8, 2956);
    			attr_dev(div2, "class", "table");
    			add_location(div2, file, 120, 8, 3234);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file, 109, 4, 2896);
    			add_location(main, file, 108, 0, 2884);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			mount_component(grantt, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			mount_component(algorithms, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			mount_component(metrics, div1, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			mount_component(table, div2, null);
    			append_dev(div3, t4);
    			mount_component(donate, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const grantt_changes = {};
    			if (dirty & /*runs*/ 16) grantt_changes.runs = /*runs*/ ctx[4];
    			grantt.$set(grantt_changes);
    			const metrics_changes = {};

    			if (!updating_quantumnTime && dirty & /*quantumnTime*/ 4) {
    				updating_quantumnTime = true;
    				metrics_changes.quantumnTime = /*quantumnTime*/ ctx[2];
    				add_flush_callback(() => updating_quantumnTime = false);
    			}

    			metrics.$set(metrics_changes);
    			const table_changes = {};
    			if (dirty & /*result*/ 8) table_changes.calculatedProcesses = /*result*/ ctx[3];

    			if (!updating_processes && dirty & /*inputProcesses*/ 1) {
    				updating_processes = true;
    				table_changes.processes = /*inputProcesses*/ ctx[0];
    				add_flush_callback(() => updating_processes = false);
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grantt.$$.fragment, local);
    			transition_in(algorithms.$$.fragment, local);
    			transition_in(metrics.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(donate.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grantt.$$.fragment, local);
    			transition_out(algorithms.$$.fragment, local);
    			transition_out(metrics.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(donate.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(grantt);
    			destroy_component(algorithms);
    			destroy_component(metrics);
    			destroy_component(table);
    			destroy_component(donate);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let result;
    	let runs;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let inputProcesses = [
    		new Process("P-1", 0, 12, 2),
    		new Process("P-2", 2, 7, 1),
    		new Process("P-3", 5, 8, 5),
    		new Process("P-4", 9, 3, 4),
    		new Process("P-5", 12, 6, 3)
    	];

    	// define column configs
    	const inputColumnsMapper = [
    		{
    			title: "Name",
    			dataType: "text",
    			getter: v => v.name,
    			setter: (process, value) => {
    				process.name = value;
    			},
    			editable: true
    		},
    		{
    			title: "Arrival Time",
    			dataType: "number",
    			getter: v => v.arrivalTime,
    			setter: (process, value) => {
    				process.arrivalTime = value;
    			},
    			min: 0,
    			editable: true
    		},
    		{
    			title: "Burst Time",
    			dataType: "number",
    			getter: v => v.burstTime,
    			setter: (process, value) => {
    				process.burstTime = value;
    			},
    			min: 1,
    			editable: true
    		},
    		{
    			title: "Priority",
    			dataType: "number",
    			getter: v => v.priority ? v.priority : "0",
    			setter: (process, value) => {
    				process.priority = value;
    			},
    			editable: true
    		},
    		{
    			title: "Finish Time",
    			dataType: "number",
    			getter: v => v.finishedTime,
    			setter: (obj, value) => {
    				throw "Not Implemented";
    			},
    			copyable: true,
    			avg: true
    		},
    		{
    			title: "Wait Time",
    			dataType: "text",
    			getter: v => v.waitTime,
    			setter: (obj, value) => {
    				throw "Not Implemented";
    			},
    			copyable: true,
    			avg: true
    		},
    		{
    			title: "Turnaround Time",
    			dataType: "text",
    			getter: v => v.turnaroundTime,
    			setter: (obj, value) => {
    				throw "Not Implemented";
    			},
    			copyable: true,
    			avg: true
    		},
    		{
    			title: "Response Time",
    			dataType: "text",
    			getter: v => v.responseTime,
    			setter: (obj, value) => {
    				throw "Not Implemented";
    			},
    			copyable: true,
    			avg: true
    		}
    	];

    	let scheduler = SortestJobFirst;
    	let quantumnTime = 4;

    	function updateInput(event) {
    		$$invalidate(0, inputProcesses = event.detail.data);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const change_handler = ({ detail: algo }) => {
    		$$invalidate(1, scheduler = algo);
    	};

    	function metrics_quantumnTime_binding(value) {
    		quantumnTime = value;
    		$$invalidate(2, quantumnTime);
    	}

    	function table_processes_binding(value) {
    		inputProcesses = value;
    		$$invalidate(0, inputProcesses);
    	}

    	$$self.$capture_state = () => ({
    		Table,
    		Grantt,
    		Algorithms: Algorithms_1,
    		Process,
    		Scheduler,
    		Metrics,
    		Donate,
    		inputProcesses,
    		inputColumnsMapper,
    		scheduler,
    		quantumnTime,
    		updateInput,
    		result,
    		runs
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputProcesses' in $$props) $$invalidate(0, inputProcesses = $$props.inputProcesses);
    		if ('scheduler' in $$props) $$invalidate(1, scheduler = $$props.scheduler);
    		if ('quantumnTime' in $$props) $$invalidate(2, quantumnTime = $$props.quantumnTime);
    		if ('result' in $$props) $$invalidate(3, result = $$props.result);
    		if ('runs' in $$props) $$invalidate(4, runs = $$props.runs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*scheduler, inputProcesses, quantumnTime*/ 7) {
    			$$invalidate(3, result = scheduler(inputProcesses.slice(), { quantumnTime }));
    		}

    		if ($$self.$$.dirty & /*result*/ 8) {
    			$$invalidate(4, runs = result.map(process => process.toGranttPeriods()).flat());
    		}
    	};

    	return [
    		inputProcesses,
    		scheduler,
    		quantumnTime,
    		result,
    		runs,
    		inputColumnsMapper,
    		updateInput,
    		change_handler,
    		metrics_quantumnTime_binding,
    		table_processes_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
