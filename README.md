# @ts-core/angular

Angular библиотека с базовыми утилитами, директивами, пайпами и сервисами для разработки веб-приложений. Предоставляет инструменты для работы с языками, темами, окнами, авторизацией, хранилищами данных и многим другим.

## Содержание

- [Установка](#установка)
- [Зависимости](#зависимости)
- [Быстрый старт](#быстрый-старт)
- [Модули](#модули)
- [Директивы](#директивы)
- [Пайпы](#пайпы)
- [Сервисы](#сервисы)
- [Авторизация](#авторизация)
- [Управление окнами](#управление-окнами)
- [Хранилища данных](#хранилища-данных)
- [Примеры использования](#примеры-использования)
- [Связанные пакеты](#связанные-пакеты)

## Установка

```bash
npm install @ts-core/angular
```

```bash
yarn add @ts-core/angular
```

```bash
pnpm add @ts-core/angular
```

## Зависимости

| Пакет | Описание |
|-------|----------|
| `@angular/core` | Angular фреймворк |
| `@ts-core/common` | Базовые классы и интерфейсы |
| `@ts-core/frontend` | Фронтенд утилиты |
| `@ts-core/language` | Поддержка локализации |
| `moment` | Работа с датами |
| `numeral` | Форматирование чисел |
| `ngx-cookie` | Работа с cookies |
| `interactjs` | Drag-and-drop и resize |

## Быстрый старт

### Подключение модуля

```typescript
import { NgModule } from '@angular/core';
import { VIModule } from '@ts-core/angular';

@NgModule({
    imports: [
        VIModule.forRoot({
            loggerLevel: LoggerLevel.ALL,
            languageOptions: {
                defaultLocale: 'ru',
                supportedLocales: ['ru', 'en']
            },
            themeOptions: {
                defaultTheme: 'light',
                supportedThemes: ['light', 'dark']
            }
        })
    ]
})
export class AppModule {}
```

### Для standalone компонентов

```typescript
import { Component } from '@angular/core';
import { VIModule } from '@ts-core/angular';

@Component({
    standalone: true,
    imports: [VIModule]
})
export class MyComponent {}
```

## Модули

### VIModule (главный модуль)

Объединяет все подмодули и предоставляет базовые сервисы:

```typescript
import { VIModule, IVIOptions } from '@ts-core/angular';

const options: IVIOptions = {
    loggerLevel: LoggerLevel.DEBUG,
    languageOptions: {
        defaultLocale: 'ru',
        supportedLocales: ['ru', 'en', 'de']
    },
    themeOptions: {
        defaultTheme: 'light',
        supportedThemes: ['light', 'dark']
    }
};

@NgModule({
    imports: [VIModule.forRoot(options)]
})
export class AppModule {}
```

### LanguageModule

Модуль локализации:

```typescript
import { LanguageModule } from '@ts-core/angular';

@NgModule({
    imports: [LanguageModule]
})
export class MyModule {}
```

### ThemeModule

Модуль тем:

```typescript
import { ThemeModule } from '@ts-core/angular';

@NgModule({
    imports: [ThemeModule]
})
export class MyModule {}
```

### AssetModule

Модуль для работы с ресурсами:

```typescript
import { AssetModule } from '@ts-core/angular';

@NgModule({
    imports: [AssetModule]
})
export class MyModule {}
```

### CookieModule

Модуль для работы с cookies:

```typescript
import { CookieModule } from '@ts-core/angular';

@NgModule({
    imports: [CookieModule]
})
export class MyModule {}
```

## Директивы

### Интерактивные директивы

#### FocusDirective

Автоматическая фокусировка элемента:

```html
<input viFocus>
<input [viFocus]="shouldFocus">
```

#### ClickToCopyDirective

Копирование текста по клику:

```html
<span viClickToCopy="Текст для копирования">Кликните чтобы скопировать</span>
<span [viClickToCopy]="dynamicText">{{ dynamicText }}</span>
```

#### ClickToSelectDirective

Выделение текста по клику:

```html
<input viClickToSelect value="Текст будет выделен">
```

#### SelectOnFocusDirective

Выделение текста при фокусе:

```html
<input viSelectOnFocus value="Выделится при фокусе">
```

### Директивы прокрутки

#### InfiniteScrollDirective

Бесконечная прокрутка:

```html
<div viInfiniteScroll (scrolled)="loadMore()">
    <div *ngFor="let item of items">{{ item }}</div>
</div>
```

#### ScrollDirective

Отслеживание прокрутки:

```html
<div viScroll (scrollChanged)="onScroll($event)">
    Контент
</div>
```

#### AutoScrollBottomDirective

Автопрокрутка вниз:

```html
<div viAutoScrollBottom>
    <div *ngFor="let message of messages">{{ message }}</div>
</div>
```

#### ScrollCheckDirective

Проверка возможности прокрутки:

```html
<div viScrollCheck (canScrollChanged)="canScroll = $event">
    Контент
</div>
```

### Директивы размера

#### ResizeDirective

Отслеживание изменения размера:

```html
<div viResize (resized)="onResize($event)">
    Контент
</div>
```

```typescript
onResize(event: { width: number; height: number }): void {
    console.log('Новый размер:', event);
}
```

#### AspectRatioResizeDirective

Сохранение пропорций:

```html
<div viAspectRatioResize [ratio]="16/9">
    Видео контейнер
</div>
```

### Директивы платформы

#### IsBrowserDirective

Отображение только в браузере:

```html
<div *viIsBrowser>
    Отображается только в браузере (не в SSR)
</div>
```

#### IsServerDirective

Отображение только на сервере:

```html
<div *viIsServer>
    Отображается только на сервере (SSR)
</div>
```

### Директивы форм

#### NullEmptyValueDirective

Преобразование пустой строки в null:

```html
<input viNullEmptyValue [(ngModel)]="value">
```

#### UppercaseValueDirective

Автоматический uppercase:

```html
<input viUppercaseValue [(ngModel)]="code">
```

### Директивы заголовков

#### HTMLTitleDirective

Установка заголовка страницы:

```html
<div [viHTMLTitle]="pageTitle"></div>
```

#### HTMLContentTitleDirective

Установка заголовка из контента элемента:

```html
<h1 viHTMLContentTitle>Заголовок страницы</h1>
```

## Пайпы

### Форматирование дат

#### MomentDatePipe

```html
{{ date | viMomentDate }}
{{ date | viMomentDate:'DD.MM.YYYY' }}
{{ date | viMomentDate:'DD MMMM YYYY':'ru' }}
```

#### MomentTimePipe

```html
{{ date | viMomentTime }}
{{ date | viMomentTime:'HH:mm:ss' }}
```

#### MomentDateFromNowPipe

```html
{{ date | viMomentDateFromNow }}
<!-- "2 часа назад", "вчера", etc. -->
```

#### MomentDateAdaptivePipe

```html
{{ date | viMomentDateAdaptive }}
<!-- Показывает время если сегодня, дату если нет -->
```

### Форматирование чисел

#### FinancePipe

```html
{{ 1234567.89 | viFinance }}
<!-- "1 234 567.89" -->

{{ 1234567.89 | viFinance:'0,0.00' }}
<!-- "1,234,567.89" -->
```

#### TimePipe

```html
{{ 3661 | viTime }}
<!-- "1:01:01" -->

{{ 125 | viTime }}
<!-- "2:05" -->
```

### Преобразование текста

#### TruncatePipe

```html
{{ longText | viTruncate:50 }}
{{ longText | viTruncate:50:'...' }}
```

#### CamelCasePipe

```html
{{ 'hello world' | viCamelCase }}
<!-- "helloWorld" -->
```

#### StartCasePipe

```html
{{ 'hello world' | viStartCase }}
<!-- "Hello World" -->
```

### Безопасность

#### SanitizePipe

```html
<div [innerHTML]="htmlContent | viSanitize:'html'"></div>
<a [href]="url | viSanitize:'url'">Ссылка</a>
<div [style.backgroundImage]="'url(' + imageUrl + ')' | viSanitize:'style'"></div>
```

### Форматирование

#### PrettifyPipe

```html
<pre>{{ jsonObject | viPrettify }}</pre>
<!-- Форматированный JSON -->
```

#### NgModelErrorPipe

```html
<span *ngIf="form.controls.email.errors">
    {{ form.controls.email.errors | viNgModelError }}
</span>
```

## Сервисы

### WindowService

Абстрактный сервис для управления окнами:

```typescript
import { WindowService, IWindowConfig } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private windowService: WindowService) {}

    openDialog(): void {
        const content = this.windowService.open(MyDialogComponent, {
            data: { message: 'Hello!' },
            width: '400px'
        });

        content.events.subscribe(event => {
            console.log('Window event:', event);
        });
    }

    showInfo(): void {
        this.windowService.info('info.message');
    }

    askQuestion(): void {
        const question = this.windowService.question('confirm.delete');
        question.yesClick.subscribe(() => {
            console.log('Подтверждено');
        });
    }
}
```

### NotificationService

Сервис уведомлений:

```typescript
import { NotificationService, NotificationConfig } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private notifications: NotificationService) {}

    showNotification(): void {
        this.notifications.show({
            message: 'Операция выполнена успешно',
            type: 'success',
            duration: 3000
        });
    }
}
```

### BottomSheetService

Сервис нижних листов:

```typescript
import { BottomSheetService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private bottomSheet: BottomSheetService) {}

    openSheet(): void {
        this.bottomSheet.open(MySheetComponent, {
            data: { items: this.items }
        });
    }
}
```

### CookieService

Работа с cookies:

```typescript
import { CookieService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private cookies: CookieService) {}

    setCookie(): void {
        this.cookies.put('token', 'value', {
            expires: new Date(Date.now() + 86400000),
            path: '/'
        });
    }

    getCookie(): string {
        return this.cookies.get('token');
    }

    removeCookie(): void {
        this.cookies.remove('token');
    }
}
```

### LocalStorageService

Работа с localStorage:

```typescript
import { LocalStorageService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private storage: LocalStorageService) {}

    saveData(): void {
        this.storage.setItem('key', 'value');
    }

    loadData(): string {
        return this.storage.getItem('key');
    }
}
```

### PlatformService

Определение платформы:

```typescript
import { PlatformService } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private platform: PlatformService) {}

    checkPlatform(): void {
        if (this.platform.isBrowser) {
            // Код для браузера
        }
        if (this.platform.isServer) {
            // Код для SSR
        }
    }
}
```

### FocusManager

Управление фокусом:

```typescript
import { FocusManager } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private focusManager: FocusManager) {}

    focusElement(): void {
        this.focusManager.focus(this.inputElement);
    }
}
```

### ResizeManager

Отслеживание изменения размера окна:

```typescript
import { ResizeManager } from '@ts-core/angular';

@Component({...})
export class MyComponent implements OnInit {
    constructor(private resizeManager: ResizeManager) {}

    ngOnInit(): void {
        this.resizeManager.events.subscribe(event => {
            console.log('Window resized:', event);
        });
    }
}
```

## Авторизация

### LoginServiceBase

Базовый класс для сервиса авторизации:

```typescript
import { LoginServiceBase, LoginServiceBaseEvent } from '@ts-core/angular';

@Injectable({ providedIn: 'root' })
export class AuthService extends LoginServiceBase<AuthEvent, LoginResponse, UserData> {
    constructor(private http: HttpClient) {
        super();
    }

    // Реализация абстрактных методов
    protected async loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
        return this.http.post<LoginResponse>('/api/auth/login', credentials).toPromise();
    }

    protected async loginSidRequest(): Promise<UserData> {
        return this.http.get<UserData>('/api/auth/me').toPromise();
    }

    protected async logoutRequest(): Promise<void> {
        await this.http.post('/api/auth/logout', {}).toPromise();
    }

    protected getSavedSid(): string {
        return localStorage.getItem('sid');
    }

    protected parseLoginResponse(response: LoginResponse): void {
        this._sid = response.token;
        localStorage.setItem('sid', response.token);
    }

    // Публичный метод входа
    public login(credentials: LoginCredentials): void {
        this.loginByParam(credentials);
    }
}
```

### Использование AuthService

```typescript
@Component({...})
export class LoginComponent {
    constructor(private auth: AuthService) {
        // Подписка на события
        this.auth.logined.subscribe(userData => {
            console.log('Пользователь вошёл:', userData);
        });

        this.auth.logouted.subscribe(() => {
            console.log('Пользователь вышел');
        });
    }

    login(): void {
        this.auth.login({ email: 'user@example.com', password: '123' });
    }

    logout(): void {
        this.auth.logout();
    }

    get isLoggedIn(): boolean {
        return this.auth.isLoggedIn;
    }
}
```

### LoginGuard

Защита маршрутов:

```typescript
import { LoginGuard, LoginNotGuard, LoginIfCanGuard } from '@ts-core/angular';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoginGuard]  // Только для авторизованных
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginNotGuard]  // Только для неавторизованных
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [LoginIfCanGuard]  // Попытка авторизации если есть токен
    }
];
```

### LoginTokenStorage

Хранение токена авторизации:

```typescript
import { LoginTokenStorage } from '@ts-core/angular';

@Injectable()
export class AuthService {
    constructor(private tokenStorage: LoginTokenStorage) {}

    saveToken(token: string): void {
        this.tokenStorage.set(token);
    }

    getToken(): string {
        return this.tokenStorage.get();
    }

    clearToken(): void {
        this.tokenStorage.remove();
    }
}
```

## Управление окнами

### WindowBase

Базовый класс для содержимого окна:

```typescript
import { WindowBase, IWindowContent } from '@ts-core/angular';

@Component({
    template: `
        <div class="window">
            <h2>{{ config.data.title }}</h2>
            <p>{{ config.data.message }}</p>
            <button (click)="close()">Закрыть</button>
        </div>
    `
})
export class MyWindowComponent extends WindowBase<MyWindowData> implements IWindowContent<MyWindowData> {
    close(): void {
        this.config.data.result = 'closed';
        this.destroy();
    }
}

interface MyWindowData {
    title: string;
    message: string;
    result?: string;
}
```

### WindowConfig

Конфигурация окна:

```typescript
import { WindowConfig, IWindowConfig } from '@ts-core/angular';

const config: IWindowConfig<MyData> = {
    data: { title: 'Заголовок' },
    width: '500px',
    height: 'auto',
    disableClose: false,
    panelClass: 'my-dialog'
};
```

### QuestionManager

Управление вопросами:

```typescript
import { QuestionManager, IQuestion } from '@ts-core/angular';

@Component({...})
export class MyComponent {
    constructor(private questionManager: QuestionManager) {}

    askConfirmation(): void {
        const question = this.questionManager.question('Вы уверены?');

        question.yesClick.subscribe(() => {
            this.deleteItem();
        });

        question.noClick.subscribe(() => {
            console.log('Отменено');
        });
    }
}
```

## Хранилища данных

### ValueStorage

Типизированное хранилище:

```typescript
import { ValueStorage, BooleanValueStorage, DateValueStorage, JSONValueStorage } from '@ts-core/angular';

// Boolean хранилище
const isDarkMode = new BooleanValueStorage(localStorage, 'darkMode', false);
isDarkMode.value = true;
console.log(isDarkMode.value);  // true

// Date хранилище
const lastVisit = new DateValueStorage(localStorage, 'lastVisit');
lastVisit.value = new Date();
console.log(lastVisit.value);  // Date object

// JSON хранилище
interface UserSettings {
    theme: string;
    language: string;
}
const settings = new JSONValueStorage<UserSettings>(localStorage, 'settings', {
    theme: 'light',
    language: 'ru'
});
settings.value = { theme: 'dark', language: 'en' };
```

## Примеры использования

### Полная настройка приложения

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VIModule, IVIOptions } from '@ts-core/angular';
import { LoggerLevel } from '@ts-core/common';

const viOptions: IVIOptions = {
    loggerLevel: LoggerLevel.DEBUG,
    languageOptions: {
        defaultLocale: 'ru',
        supportedLocales: ['ru', 'en', 'de'],
        loadUrl: '/api/language'
    },
    themeOptions: {
        defaultTheme: 'light',
        supportedThemes: ['light', 'dark', 'auto']
    }
};

@NgModule({
    imports: [
        BrowserModule,
        VIModule.forRoot(viOptions)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

### Компонент с локализацией

```typescript
import { Component } from '@angular/core';
import { LanguageService } from '@ts-core/frontend';

@Component({
    selector: 'app-greeting',
    template: `
        <h1>{{ 'greeting.title' | viLanguage }}</h1>
        <p>{{ 'greeting.message' | viLanguage:{ name: userName } }}</p>

        <select (change)="changeLanguage($event.target.value)">
            <option *ngFor="let locale of locales" [value]="locale">
                {{ locale }}
            </option>
        </select>
    `
})
export class GreetingComponent {
    userName = 'Иван';
    locales = ['ru', 'en', 'de'];

    constructor(private language: LanguageService) {}

    changeLanguage(locale: string): void {
        this.language.setLocale(locale);
    }
}
```

### Компонент с темами

```typescript
import { Component } from '@angular/core';
import { ThemeService } from '@ts-core/frontend';

@Component({
    selector: 'app-theme-toggle',
    template: `
        <button (click)="toggleTheme()">
            {{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
        </button>

        <div [viThemeStyle]="{ color: 'primary' }">
            Текст в цвете темы
        </div>
    `
})
export class ThemeToggleComponent {
    constructor(private theme: ThemeService) {}

    get isDark(): boolean {
        return this.theme.current === 'dark';
    }

    toggleTheme(): void {
        this.theme.setTheme(this.isDark ? 'light' : 'dark');
    }
}
```

### Список с бесконечной прокруткой

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-infinite-list',
    template: `
        <div class="list" viInfiniteScroll (scrolled)="loadMore()">
            <div *ngFor="let item of items" class="item">
                {{ item.name }}
            </div>
            <div *ngIf="isLoading" class="loading">Загрузка...</div>
        </div>
    `
})
export class InfiniteListComponent {
    items: any[] = [];
    isLoading = false;
    page = 1;

    async loadMore(): Promise<void> {
        if (this.isLoading) return;

        this.isLoading = true;
        const newItems = await this.loadPage(this.page++);
        this.items = [...this.items, ...newItems];
        this.isLoading = false;
    }

    private async loadPage(page: number): Promise<any[]> {
        // Загрузка данных с сервера
        return fetch(`/api/items?page=${page}`).then(r => r.json());
    }
}
```

## API Reference

### VIModule

| Метод | Описание |
|-------|----------|
| `forRoot(options?)` | Создать модуль с настройками |

### IVIOptions

| Свойство | Тип | Описание |
|----------|-----|----------|
| `loggerLevel` | `LoggerLevel` | Уровень логирования |
| `languageOptions` | `ILanguageServiceOptions` | Настройки локализации |
| `themeOptions` | `IThemeServiceOptions` | Настройки тем |

### WindowService

| Метод | Описание |
|-------|----------|
| `open(component, config)` | Открыть окно |
| `get(id)` | Получить окно по ID |
| `has(id)` | Проверить наличие окна |
| `close(id)` | Закрыть окно |
| `closeAll()` | Закрыть все окна |
| `info(translationId, translation?, options?)` | Показать информационное окно |
| `question(translationId, translation?, options?)` | Показать окно подтверждения |

### LoginServiceBase

| Свойство/Метод | Тип | Описание |
|----------------|-----|----------|
| `isLoggedIn` | `boolean` | Авторизован ли пользователь |
| `isLoading` | `boolean` | Идёт процесс авторизации |
| `sid` | `string` | Текущий токен сессии |
| `loginData` | `V` | Данные пользователя |
| `login(param)` | `void` | Выполнить вход |
| `logout()` | `Promise<void>` | Выполнить выход |
| `logined` | `Observable<V>` | Событие успешного входа |
| `logouted` | `Observable<void>` | Событие выхода |

## Связанные пакеты

| Пакет | Описание |
|-------|----------|
| `@ts-core/angular-material` | Material компоненты для Angular |
| `@ts-core/frontend` | Базовые фронтенд утилиты |
| `@ts-core/common` | Общие классы и интерфейсы |
| `@ts-core/language` | Поддержка локализации |

## Автор

**Renat Gubaev** — [renat.gubaev@gmail.com](mailto:renat.gubaev@gmail.com)

- GitHub: [ManhattanDoctor](https://github.com/ManhattanDoctor)
- Репозиторий: [ts-core-frontend-angular](https://github.com/ManhattanDoctor/ts-core-frontend-angular)

## Лицензия

ISC
