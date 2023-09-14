import { ElementRef, Renderer2, RendererStyleFlags2, ViewContainerRef } from '@angular/core';
import { ExtendedError } from '@ts-core/common';
import * as _ from 'lodash';

export class ViewUtil {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    private static _renderer: Renderer2 = null;
    private static _document: Document = null;

    public static get renderer(): Renderer2 {
        if (_.isNil(ViewUtil._renderer)) {
            throw new ExtendedError(`ViewUtil is not initialized: renderer in nil`);
        }
        return ViewUtil._renderer;
    }
    public static set renderer(value: Renderer2) {
        if (value === ViewUtil._renderer) {
            return;
        }
        ViewUtil._renderer = value;
    }

    public static get document(): Document {
        return !_.isNil(ViewUtil._document) ? ViewUtil._document : document;
    }
    public static set document(value: Document) {
        ViewUtil._document = value;
    }

    public static get window(): Window {
        return this.document.defaultView;
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private static copyToClipboard(): void {
        try {
            ViewUtil.document.execCommand('copy');
        } catch (error) {}
    }

    // --------------------------------------------------------------------------
    //
    //	Common Properties
    //
    // --------------------------------------------------------------------------

    public static parseElement<T extends HTMLElement = HTMLElement>(element: IViewElement<T>): T {
        if (element instanceof HTMLElement) {
            return element as T;
        }
        if (element instanceof ViewContainerRef) {
            element = element.element;
        }
        return !_.isNil(element) ? element.nativeElement : null;
    }

    public static createBase64(element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): string {
        let value = null;
        let canvas = ViewUtil.createElement('canvas');
        ViewUtil.setProperty(canvas, 'width', element.offsetWidth);
        ViewUtil.setProperty(canvas, 'height', element.offsetHeight);

        try {
            let context = canvas.getContext('2d');
            context.drawImage(element, 0, 0, element.offsetWidth, element.offsetHeight);
            value = canvas.toDataURL('image/jpeg', 1.0);
            value = value.replace('data:image/jpeg;base64,', '');
        } catch (error) {}
        return value;
    }

    public static selectContent(container: IViewElement, isNeedCopyToClipboard: boolean = false): void {
        container = ViewUtil.parseElement(container);
        if (container instanceof HTMLInputElement || container instanceof HTMLTextAreaElement) {
            let isWasDisabled = container.disabled;
            if (isWasDisabled) {
                container.disabled = false;
            }
            container.select();
            if (isNeedCopyToClipboard) {
                ViewUtil.copyToClipboard();
            }
            if (isWasDisabled) {
                container.disabled = true;
            }
        } else {
            let selection = ViewUtil.window.getSelection();
            selection.removeAllRanges();

            let range = ViewUtil.document.createRange();
            if (!_.isNil(container)) {
                range.selectNodeContents(container);
            }
            selection.addRange(range);

            if (isNeedCopyToClipboard) {
                ViewUtil.copyToClipboard();
            }
        }
    }

    public static setBackground(container: IViewElement, image: string, repeat: string = 'repeat'): void {
        if (_.isNil(image)) {
            ViewUtil.removeStyle(container, 'backgroundImage');
            ViewUtil.removeStyle(container, 'backgroundRepeat');
            return;
        }

        if (!image.includes('url(')) {
            image = 'url(' + image + ')';
        }

        ViewUtil.setStyle(container, 'backgroundImage', image);
        ViewUtil.setStyle(container, 'backgroundRepeat', repeat);
    }

    // --------------------------------------------------------------------------
    //
    //	Child Methods
    //
    // --------------------------------------------------------------------------

    public static createElement<T = any>(name: string, className?: string, innerHTML?: string): T {
        let element = ViewUtil.renderer.createElement(name);
        if (!_.isNil(name)) {
            ViewUtil.setProperty(element, 'className', className);
        }
        if (!_.isNil(innerHTML)) {
            ViewUtil.setProperty(element, 'innerHTML', innerHTML);
        }
        return element;
    }

    public static appendChild(parent: any, child: any): void {
        if (!_.isNil(parent) && !_.isNil(child)) {
            ViewUtil.renderer.appendChild(parent, child);
        }
    }

    public static removeChild(parent: any, child: any): void {
        if (!_.isNil(parent) && !_.isNil(child)) {
            ViewUtil.renderer.removeChild(parent, child);
        }
    }

    public static toggleChild(container: Node, child: Node, value: boolean): void {
        let isContains = container.contains(child);
        if (value && !isContains) {
            ViewUtil.appendChild(container, child);
        }
        if (!value && isContains) {
            ViewUtil.removeChild(container, child);
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Size Methods
    //
    // --------------------------------------------------------------------------

    public static getStageWidth(): number {
        return ViewUtil.window.innerWidth || ViewUtil.document.body.clientWidth;
    }

    public static getStageHeight(): number {
        return ViewUtil.window.innerHeight || ViewUtil.document.body.clientHeight;
    }

    public static getCanvasContext2d(container: IViewElement<HTMLCanvasElement>, options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D {
        let canvas = ViewUtil.parseElement(container);
        try {
            return canvas.getContext('2d', options);
        } catch (error) {
            return null;
        }
    }

    public static getBoundingRectangle(container: IViewElement): DOMRect {
        container = ViewUtil.parseElement(container);
        if (_.isNil(container) || _.isNil(container.getBoundingClientRect)) {
            return {
                x: NaN,
                y: NaN,
                width: NaN,
                height: NaN,
                top: NaN,
                right: NaN,
                left: NaN,
                bottom: NaN
            } as DOMRect;
        }
        return container.getBoundingClientRect();
    }

    public static getWidth(container: IViewElement): number {
        container = ViewUtil.parseElement(container);
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'width'));
        if (_.isNaN(value)) {
            value = ViewUtil.getBoundingRectangle(container).width;
        }
        if (_.isNaN(value)) {
            value = container.offsetWidth;
        }
        return value;
    }

    public static setWidth(container: IViewElement, value: number, isNeedCheckLimits: boolean = false): boolean {
        if (_.isNil(container) || _.isNaN(value)) {
            return false;
        }

        if (
            isNeedCheckLimits &&
            (value < ViewUtil.getMinWidth(container) || value > ViewUtil.getMaxWidth(container) || value === ViewUtil.getWidth(container))
        ) {
            return false;
        }

        ViewUtil.setStyle(container, 'width', value + 'px');
        return true;
    }

    public static getMaxWidth(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'maxWidth'));
        if (_.isNaN(value)) {
            value = Number.POSITIVE_INFINITY;
        }
        return value;
    }

    public static getMinWidth(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'minWidth'));
        if (_.isNaN(value)) {
            value = 0;
        }
        return value;
    }

    public static getHeight(container: IViewElement): number {
        container = ViewUtil.parseElement(container);
        if (_.isNil(container)) {
            return NaN;
        }

        let value = parseFloat(ViewUtil.getStyle(container, 'height'));
        if (_.isNaN(value)) {
            value = ViewUtil.getBoundingRectangle(container).height;
        }
        if (_.isNaN(value)) {
            value = container.offsetHeight;
        }
        return value;
    }
    public static setHeight(container: IViewElement, value: number, isNeedCheckLimits: boolean = false): boolean {
        if (_.isNil(container) || _.isNaN(value)) {
            return false;
        }
        if (
            isNeedCheckLimits &&
            (value < ViewUtil.getMinHeight(container) || value > ViewUtil.getMaxHeight(container) || value === ViewUtil.getHeight(container))
        ) {
            return false;
        }
        ViewUtil.setStyle(container, 'height', value + 'px');
        return true;
    }
    public static getMaxHeight(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'maxHeight'));
        if (_.isNaN(value)) {
            value = Number.POSITIVE_INFINITY;
        }
        return value;
    }
    public static getMinHeight(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'minHeight'));
        if (isNaN(value)) {
            value = 0;
        }
        return value;
    }

    public static size(container: IViewElement, width: number, height: number, isNeedCheckLimits: boolean): void {
        ViewUtil.setWidth(container, width, isNeedCheckLimits);
        ViewUtil.setHeight(container, height, isNeedCheckLimits);
    }

    public static getX(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'left'));
        return _.isNaN(value) ? 0 : value;
    }

    public static setX(container: IViewElement, value: number): void {
        if (!_.isNil(container) && !_.isNaN(value)) {
            ViewUtil.setStyle(container, 'left', value + 'px');
        }
    }

    public static getY(container: IViewElement): number {
        if (_.isNil(container)) {
            return NaN;
        }
        let value = parseFloat(ViewUtil.getStyle(container, 'top'));
        return _.isNaN(value) ? 0 : value;
    }
    public static setY(container: IViewElement, value: number): void {
        if (!_.isNil(container) && !_.isNaN(value)) {
            ViewUtil.setStyle(container, 'top', value + 'px');
        }
    }
    public static move(container: IViewElement, x: number, y: number): void {
        ViewUtil.setX(container, x);
        ViewUtil.setY(container, y);
    }

    // --------------------------------------------------------------------------
    //
    //	Focus Methods
    //
    // --------------------------------------------------------------------------

    public static focusInput(input: HTMLInputElement | HTMLTextAreaElement): void {
        let caretIndex = 0;
        if (!_.isNil(input.value)) {
            caretIndex = Math.max(0, input.value.toString().length);
        }
        input.focus();
        input.setSelectionRange(caretIndex, caretIndex);
    }

    // --------------------------------------------------------------------------
    //
    //	Classes Methods
    //
    // --------------------------------------------------------------------------

    public static addClass(container: IViewElement, name: string): void {
        if (_.isEmpty(name)) {
            return;
        }
        container = ViewUtil.parseElement(container);
        if (!_.isNil(container)) {
            ViewUtil.renderer.addClass(container, name);
        }
    }

    public static addClasses(container: IViewElement, names: string): void {
        if (_.isEmpty(names)) {
            return;
        }
        names.split(' ').forEach(name => ViewUtil.addClass(container, name));
    }

    public static removeClass(container: IViewElement, name: string): void {
        if (_.isEmpty(name)) {
            return;
        }
        container = ViewUtil.parseElement(container);
        if (!_.isNil(container)) {
            ViewUtil.renderer.removeClass(container, name);
        }
    }

    public static removeClasses(container: IViewElement, names: string): void {
        if (_.isEmpty(names)) {
            return;
        }
        names.split(' ').forEach(name => ViewUtil.removeClass(container, name));
    }

    public static hasClass(container: IViewElement, name: string): boolean {
        if (_.isNil(name)) {
            return false;
        }
        container = ViewUtil.parseElement(container);
        return !_.isNil(container) ? container.classList.contains(name) : false;
    }

    public static toggleClass(container: IViewElement, name: string, value: boolean): void {
        if (value) {
            ViewUtil.addClass(container, name);
        } else {
            ViewUtil.removeClass(container, name);
        }
    }

    public static toggleClasses(container: IViewElement, name: string, value: boolean): void {
        if (value) {
            ViewUtil.addClasses(container, name);
        } else {
            ViewUtil.removeClasses(container, name);
        }
    }

    public static getProperty(container: IViewElement, name: string): any {
        if (_.isNil(name)) {
            return null;
        }
        container = ViewUtil.parseElement(container);
        return !_.isNil(container) ? container[name] : null;
    }

    public static setProperty(container: IViewElement, name: string, value: any): void {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return;
        }
        if (!_.isNil(value)) {
            ViewUtil.renderer.setProperty(container, name, value);
        } else {
            ViewUtil.removeProperty(container, name);
        }
    }

    public static removeProperty(container: IViewElement, name: string): void {
        ViewUtil.removeAttribute(container, name);
    }

    public static removeAttribute(container: IViewElement, name: string): void {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return;
        }
        ViewUtil.renderer.removeAttribute(container, name);
    }

    public static setAttribute(container: IViewElement, name: string, value: any): void {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return;
        }
        if (!_.isNil(value)) {
            ViewUtil.renderer.setAttribute(container, name, value);
        } else {
            ViewUtil.removeAttribute(container, name);
        }
    }

    public static getStyle(container: IViewElement, name: string): any {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return null;
        }
        return container.style[name];
    }

    public static setStyle(container: IViewElement, name: string, value: any, flags?: RendererStyleFlags2): void {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return;
        }
        if (value !== ViewUtil.getStyle(container, name)) {
            ViewUtil.renderer.setStyle(container, name, value, flags);
        }
    }

    public static removeStyle(container: IViewElement, name: string, flags?: RendererStyleFlags2): void {
        container = ViewUtil.parseElement(container);
        if (_.isNil(name) || _.isNil(container)) {
            return;
        }
        ViewUtil.renderer.removeStyle(container, name, flags);
    }

    // --------------------------------------------------------------------------
    //
    //	Video Methods
    //
    // --------------------------------------------------------------------------

    public static createVideo(isMute: boolean = true, isInline: boolean = false): HTMLVideoElement {
        let video = ViewUtil.createElement('video');
        ViewUtil.setProperty(video, 'autoplay', true);
        if (isMute) {
            ViewUtil.setVideoMuteParameters(video, isMute);
        }
        if (isInline) {
            ViewUtil.setVideoInlineParameters(video);
        }
        return video;
    }

    public static setVideoMuteParameters(video: HTMLVideoElement, isMute: boolean = true): void {
        if (!_.isNil(video)) {
            video.muted = video.defaultMuted = isMute;
        }
    }

    public static setVideoInlineParameters(video: HTMLVideoElement): void {
        ViewUtil.setAttribute(video, 'webkit-playsinline', 1);
        ViewUtil.setAttribute(video, 'playsinline', true);
    }

    public static getVideoError(video: HTMLVideoElement): string {
        if (_.isNil(video) || _.isNil(video.error)) {
            return null;
        }

        let error: MediaError = video.error;
        let value = 'Video error ' + video.src + ', ';
        switch (error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                value += 'media aborted';
                break;
            case MediaError.MEDIA_ERR_DECODE:
                value += 'error to decode';
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                value += 'network error';
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                value += 'source not supported';
                break;
        }
        return value;
    }

    public static playVideo(video: HTMLVideoElement): Promise<void> {
        if (_.isNil(video)) {
            return null;
        }

        try {
            return video.play();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static playAudio(audio: HTMLAudioElement): Promise<void> {
        if (_.isNil(audio)) {
            return null;
        }
        try {
            return audio.play();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static pauseVideo(video: HTMLVideoElement): void {
        if (!_.isNil(video)) {
            video.pause();
        }
    }

    public static isVideoPlaying(video: HTMLVideoElement): boolean {
        return !_.isNil(video) ? !video.paused && !video.ended : false;
    }

    public static loadVideo(video: HTMLVideoElement): void {
        if (!_.isNil(video)) {
            video.load();
        }
    }

    public static stopVideoIfNeed(video: HTMLVideoElement): void {
        if (!_.isNil(video) && (!_.isNil(video.src) || !_.isNil(video.srcObject))) {
            ViewUtil.stopVideo(video);
        }
    }

    public static stopVideo(video: HTMLVideoElement): void {
        if (_.isNil(video)) {
            return;
        }

        if (video.srcObject instanceof MediaStream) {
            let tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        video.srcObject = null;

        video.pause();
        video.src = '';
        video.load();
    }

    public static disposeVideo(video: HTMLVideoElement): void {
        ViewUtil.stopVideo(video);
        ViewUtil.removeChild(video.parentNode, video);
        video.remove();
    }

    public static disposeVideos(container: IViewElement): void {
        container = ViewUtil.parseElement(container);
        for (let i = container.children.length - 1; i >= 0; i--) {
            let item = container.children.item(i);
            if (item instanceof HTMLVideoElement) {
                ViewUtil.disposeVideo(item);
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Object Methods
    //
    // --------------------------------------------------------------------------

    public static disposeObjects(container: IViewElement, isIEBrowser?: boolean): void {
        container = ViewUtil.parseElement(container);
        for (let i = container.children.length - 1; i >= 0; i--) {
            let item = container.children.item(i);
            if (item instanceof HTMLObjectElement) {
                ViewUtil.disposeObject(item, isIEBrowser);
            }
        }
    }

    public static disposeObject(object: HTMLObjectElement, isIEBrowser?: boolean): void {
        if (isIEBrowser && object['readyState'] === 4) {
            for (let i in object) {
                if (_.isFunction(object[i])) {
                    object[i] = null;
                }
            }
        }
        ViewUtil.removeChild(object.parentNode, object);
    }
}

export type IViewElement<T extends HTMLElement = HTMLElement> = HTMLElement | ElementRef<T> | ViewContainerRef;
