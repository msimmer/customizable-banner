class Banner {
    static defaultElements = {
        _dashboard: {
            elem: 'div',
            props: { id: 'dashboard' },
            css: {
                position: 'relative',
                top: 100,
                left: 100,
            }

        },
        _view: {
            elem: 'div',
            props: { id: 'view' },
        },

        _rangeElemCount: {
            elem: 'input',
            label: 'Points',
            props: {
                type: 'range',
                min: 1,
                max: 19,
                step: 2,
            },
        },
        _rangeElemDimensions: {
            elem: 'input',
            label: 'Size',
            props: {
                type: 'range',
                min: 100,
                max: 400,
                step: 10,
            },
        },
        _rangeFontSize: {
            elem: 'input',
            label: 'Font Size',
            props: {
                type: 'range',
                min: 8,
                max: 32,
                step: 1,
            },
        },
        _rangeTextRotation: {
            elem: 'input',
            label: 'Text Rotation',
            props: {
                type: 'range',
                value: 0,
                min: 0,
                max: 360,
                step: 1,
            },
        },
        _inputElemBgColor: {
            elem: 'input',
            label: 'Background Colour',
            props: {
                type: 'color',
            },
        },
        _inputTextFontColor: {
            elem: 'input',
            label: 'Font Colour',
            props: {
                type: 'color',
            },
        },

        _inputTextInput: { elem: 'textarea', props: { cols: 40, rows: 5 } },
    }

    static defaultValues = {
        elemCount: 0,
        elemDimensions: 200,
        fontSize: 16,
        textRotation: 0,
        elemBgColor: '#ff0000',
        textFontColor: '#ffffff',
        textInput: 'Here is some sample text—update values on the left to change the banner’s appearance',
    }

    static displaySettings = {
        viewOnly: false,
    }

    _$objectify(elem) {
        if (elem instanceof $) {
            return elem
        } else if (typeof elem === 'string') {
            if ($(elem).length) {
                return $(elem)
            } else {
                throw new Error(`Could not find element [${elem}]`)
            }
        } else {
            throw new Error(`[root] option must be a string or jQuery object, [${typeof elem}] provided`)
        }
    }

    constructor(options = {}) {
        this.container = !{}.hasOwnProperty.call(options, 'root') ? $('#root') : this._$objectify(options.root)
        this.elemTextOutput = $('<div id="text-output" />')

        this.displaySettings = { ...Banner.displaySettings }

        const defaultValues = { ...Banner.defaultValues }
        const defaultElements = { ...Banner.defaultElements }


        for (const k in options) {
            if ({}.hasOwnProperty.call(options, k) && {}.hasOwnProperty.call(defaultValues, k)) {
                defaultValues[k] = options[k]
            }
        }


        for (const k in defaultElements) {
            if ({}.hasOwnProperty.call(defaultElements, k)) {
                this[k] = defaultElements[k]
            }
        }

        for (const _key in defaultValues) {
            if ({}.hasOwnProperty.call(defaultValues, _key)) {
                this[_key] = defaultValues[_key]

                const key = [..._key]
                const upperCaseKey = `${key.shift().toUpperCase()}${[...key].join('')}`
                const rangeSelector = `_range${upperCaseKey}`
                const inputSelector = `_input${upperCaseKey}`

                let selector
                if (defaultElements[rangeSelector] && defaultElements[rangeSelector].props) {
                    selector = rangeSelector
                } else if (defaultElements[inputSelector] && defaultElements[inputSelector].props) {
                    selector = inputSelector
                }

                if (!selector) { return }

                this[selector] = {
                    ...defaultElements[selector],
                    props: {
                        ...defaultElements[selector].props,
                        value: defaultValues[_key],
                    },
                }

                if (this[selector].elem === 'textarea') {
                    this[selector].props.html = this[selector].props.value
                }
            }
        }

        for (const _key in defaultElements) {
            if ({}.hasOwnProperty.call(defaultElements, _key)) {
                const key = _key.slice(1)
                this[key] = $(`<${defaultElements[_key].elem} />`, {
                    'data-key': _key,
                    ...this[_key].props
                })
            }
        }

        this.appendAll()
        this.bind()
        this.render()
    }
    labelFor(elem) {
        const label = $('<label>')
        label.append(Banner.defaultElements[elem.attr('data-key')].label)
        label.append(elem)
        label.append('<br>')
        return label
    }
    appendAll() {
        if (!this.displaySettings.viewOnly) {
            this.container.append(
                this.dashboard.append(
                    this.labelFor(this.rangeElemCount),
                    this.labelFor(this.rangeElemDimensions),
                    this.labelFor(this.rangeFontSize),
                    this.labelFor(this.rangeTextRotation),
                    this.labelFor(this.inputElemBgColor),
                    this.labelFor(this.inputTextFontColor),
                    this.labelFor(this.inputTextInput),
                )
            )
        }
        this.view.append(this.elemTextOutput)
        this.container.append(this.view)
    }

    applyTransforms(type, _value) {
        let value = _value
        if (!{}.hasOwnProperty.call(this, type)) { return value }
        if (type === 'textInput') {
            value = value.replace(/\n/g, '<br/>')
        }

        return value
    }

    bind() {
        this.rangeElemCount.on('change', (e) => { this.elemCount = e.target.value; this.render() })
        this.rangeElemDimensions.on('change', (e) => { this.elemDimensions = e.target.value; this.render() })
        this.rangeFontSize.on('change', (e) => { this.fontSize = e.target.value; this.render() })
        this.rangeTextRotation.on('change', (e) => { this.textRotation = e.target.value; this.render() })
        this.inputElemBgColor.on('change', (e) => { this.elemBgColor = e.target.value; this.render() })
        this.inputTextFontColor.on('change', (e) => { this.textFontColor = e.target.value; this.render() })
        this.inputTextInput.on('keyup', (e) => { this.textInput = this.applyTransforms('textInput', e.target.value); this.render() })
    }
    reset() {
        $('.layer').remove()
    }
    export() {
        const { elemCount, elemDimensions, fontSize, textRotation, elemBgColor, textFontColor, textInput } = this
        return { elemCount, elemDimensions, fontSize, textRotation, elemBgColor, textFontColor, textInput }
    }
    render() {
        this.reset()
        const len = this.elemCount
        const rotation = 360 / len
        const circular = len <= 1
        const borderRadius = circular ? '50%' : 0
        const padding = circular ? 35 : 0
        const top = circular ? -38 : 0
        const left = circular ? -35 : 0

        let step = 0
        for (let i = 0; i < len; i++) {
            step += rotation
            const layer = $('<div />', {
                'class': 'layer',
                css: {
                    position: 'absolute',
                    transform: `rotate(${step}deg)`,
                    width: this.elemDimensions,
                    height: this.elemDimensions,
                    backgroundColor: this.elemBgColor,
                    borderRadius,
                    padding,
                    top,
                    left,
                },
            })
            this.view.prepend(layer)
        }


        this.elemTextOutput
        .html(this.textInput)
        .css({
            fontSize: `${this.fontSize}px`,
            color: this.textFontColor,
            transform: `rotate(${this.textRotation}deg)`,
            width: this.elemDimensions,
            height: this.elemDimensions,
        })

        this.view.css({
            width: this.elemDimensions,
            height: this.elemDimensions,
        })
    }
}


window.Banner = Banner
