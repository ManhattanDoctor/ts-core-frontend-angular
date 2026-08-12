# @ts-core/angular

> Базовый слой Angular-приложений экосистемы ts-core: настройка одним вызовом, язык, темы, директивы, пайпы и абстракции окон

[![npm version](https://img.shields.io/npm/v/@ts-core/angular.svg)](https://www.npmjs.com/package/@ts-core/angular)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Нижний уровень фронтенда: сервисы языка, тем и загрузки, набор директив и пайпов, хранилища значений, вход в систему, а также абстракции окон, уведомлений и нижних листов. Реализации этих абстракций живут в [`@ts-core/angular-material`](https://www.npmjs.com/package/@ts-core/angular-material), поэтому прикладной код работает с `WindowService`, а не с конкретным диалогом Material.

## Содержание

- [Описание](#описание)
  - [Основные возможности](#основные-возможности)
- [Установка](#установка)
  - [Зависимости](#зависимости)
  - [Полифиллы](#полифиллы)
  - [Стили и ресурсы](#стили-и-ресурсы)
- [Быстрый старт](#быстрый-старт)
- [Настройка приложения](#настройка-приложения)
  - [provideVI и viProviders](#providevi-и-viproviders)
  - [Почему остались модули](#почему-остались-модули)
- [Язык](#язык)
- [Темы](#темы)
- [Директивы](#директивы)
- [Пайпы](#пайпы)
- [Списки](#списки)
- [Окна и уведомления](#окна-и-уведомления)
- [Хранилища значений](#хранилища-значений)
- [Вход в систему](#вход-в-систему)
- [Структура проекта](#структура-проекта)
- [История изменений](#история-изменений)
- [Лицензия](#лицензия)

## Описание

Пакет решает задачи, которые повторяются в каждом приложении: перевести интерфейс, переключить тему, показать окно, спросить подтверждение, сохранить значение между сессиями. Всё это настраивается одним вызовом в конфигурации приложения и дальше доступно через внедрение зависимостей.

### Основные возможности

- **Настройка одним вызовом** — `provideVI(options)` поднимает язык, темы, куки, журнал и разметку, `NgModule` не нужен
- **Переводы** — `LanguageService` с загрузчиками из файла, по адресу или из памяти, пайпы `viTranslate` и директива `[vi-translate]`
- **Темы** — `ThemeService` хранит выбор в куках и вешает имя темы классом на `body`
- **Директивы и пайпы** — фокус, копирование по нажатию, бесконечная прокрутка, обрезка текста, даты и денежные суммы
- **Абстракции окон** — `WindowService`, `NotificationService`, `BottomSheetService` без привязки к библиотеке отрисовки
- **Хранилища значений** — типизированные обёртки над `localStorage` и куками
- **Вход в систему** — `LoginServiceBase`, охранники маршрутов и хранилище токена

## Установка

```bash
npm install @ts-core/angular
```

### Зависимости

```json
{
    "@angular/core": "^22.1.1",
    "@ts-core/common": "~3.0.69",
    "@ts-core/frontend": "~3.0.20",
    "@ts-core/language": "~3.0.38",
    "moment": "^2.30.1",
    "numeral": "^2.0.6",
    "ngx-cookie": "^6.0.1"
}
```

Требуется Angular 22 и Node 22.22.3 или новее.

### Полифиллы

`@ts-core/common` использует `util.inspect` для подробного журнала транспорта, поэтому браузерному приложению нужны `process` и `Buffer`:

```ts
// src/polyfills.ts
import * as buffer from 'buffer';
import * as process from 'process';

let value = globalThis as any;
value.global = value;
value.Buffer = value.Buffer || buffer.Buffer;
value.process = value.process || process;
```

```json
// angular.json → architect.build.options
{
    "polyfills": ["zone.js", "src/polyfills.ts"],
    "allowedCommonJsDependencies": ["util", "lodash", "moment", "numeral", "axios"]
}
```

Без этого сборка падает с `Could not resolve "util"`, а приложение — с `ReferenceError: process is not defined`.

### Стили и ресурсы

Пакет содержит примеси Sass, переводы своих сообщений и вспомогательный скрипт:

```
_index.scss              примеси прокрутки, текста, курсора и фильтров
asset/language/*.json    переводы ru и en
htdocs/common.js         скрипт для страницы
```

```scss
// styles.scss
@use '@ts-core/angular' as vi;
```

```json
// angular.json → architect.build.options
{
    "stylePreprocessorOptions": { "includePaths": ["./node_modules"] },
    "assets": [{ "glob": "**/*", "input": "node_modules/@ts-core/angular/asset/language", "output": "/assets/language" }]
}
```

## Быстрый старт

```ts
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideVI } from '@ts-core/angular';
import { LoggerLevel } from '@ts-core/common';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideVI({ loggerLevel: LoggerLevel.LOG })
    ]
};
```

```ts
// app.ts
import { Component, inject } from '@angular/core';
import { LanguageService, ThemeService } from '@ts-core/frontend';
import { ClickToCopyDirective, TimePipe } from '@ts-core/angular';

@Component({
    selector: 'app-root',
    imports: [ClickToCopyDirective, TimePipe],
    template: `
        <span #source>{{ 3725 | viTime }}</span>
        <p [vi-click-to-copy]="source">Скопировать</p>
    `
})
export class App {
    private language = inject(LanguageService);
    private theme = inject(ThemeService);
}
```

## Настройка приложения

### provideVI и viProviders

`provideVI` возвращает `EnvironmentProviders` и передаётся в `providers` при загрузке приложения:

```ts
provideVI({
    loggerLevel: LoggerLevel.LOG,
    themeOptions: { name: 'theme' },
    languageOptions: { name: 'language' }
})
```

Если провайдеры нужно смешать со своими или переопределить часть из них, используется `viProviders` — тот же список без обёртки:

```ts
providers: [
    ...viProviders(options),
    { provide: LoginServiceBase, useClass: LoginService }
]
```

Вместе с сервисами регистрируется инициализатор приложения: он заполняет `ViewUtil.renderer` и `ViewUtil.document` до первой отрисовки. Без него утилиты работы с разметкой не смогут менять классы и стили.

### Почему остались модули

`VIModule.forRoot()` продолжает работать и настраивает то же самое. Все директивы и пайпы стали самостоятельными, а модуль их импортирует и отдаёт дальше — приложениям на `NgModule` менять ничего не нужно, а приложения на самостоятельных компонентах импортируют по отдельности только то, что используют.

## Язык

`LanguageService` из `@ts-core/frontend` регистрируется провайдерами пакета. Загрузчик выбирается приложением:

```ts
import { LanguagePreloadLoader, LanguageUrlLoader } from '@ts-core/language';

language.loader = new LanguageUrlLoader('assets/language/');   // ru.json, en.json рядом с приложением
language.loader = new LanguagePreloadLoader(new Map([['ru', словарь]]));   // словарь в памяти
language.loadIfExist('ru');
```

Переводы стоит загружать до первой отрисовки — тогда подписи попадают в разметку сразу:

```ts
provideAppInitializer(() => {
    let language = inject(LanguageService);
    let value = firstValueFrom(language.completed);
    language.loadIfExist('ru');
    return value;
})
```

В шаблонах доступны пайпы `viTranslate`, `viTranslatePure`, `viTranslateHas` и директивы `[vi-translate]`, `[vi-language-toggle]`.

Подстановка значений использует одинарные фигурные скобки:

```json
{ "paginator": { "pageRange": "{current} из {total}" } }
```

## Темы

Список тем задаёт приложение, выбранная тема сохраняется в куках и вешается классом на `body`:

```ts
theme.initialize([
    { name: 'light', isDark: false, styles: { background: '#ffffff' } },
    { name: 'dark', isDark: true, styles: { background: '#202020' } }
]);
theme.loadIfExist('light');
```

```scss
body.dark-theme {
    // палитра тёмной темы
}
```

Переключение — директивой `[vi-theme-toggle]` либо присваиванием `theme.theme`. Директивы `[vi-theme-style]`, `[vi-theme-icon]`, `[vi-theme-image]`, `[vi-theme-background]` подставляют значения из описания текущей темы.

## Директивы

| Селектор | Назначение |
|---|---|
| `[vi-focus]` | ставит фокус на элемент после отрисовки |
| `[vi-select-on-focus]` | выделяет содержимое поля при получении фокуса |
| `[vi-click-to-copy]` | копирует содержимое указанного элемента по нажатию |
| `[vi-click-to-select]` | выделяет содержимое элемента по нажатию |
| `[vi-infinite-scroll]` | сообщает о достижении конца списка |
| `[vi-scroll]`, `[vi-scroll-check]` | события прокрутки и проверка положения |
| `[vi-auto-scroll-bottom]` | держит прокрутку внизу при добавлении содержимого |
| `[vi-resize]`, `[vi-aspect-ratio]` | изменение размера и соотношение сторон |
| `[vi-html-title]`, `[vi-html-content-title]` | всплывающая подсказка из содержимого |
| `[viIsBrowser]`, `[viIsServer]` | показ содержимого в зависимости от среды выполнения |
| `input[nullEmptyValue]`, `input[uppercaseValue]` | нормализация значения поля ввода |

## Пайпы

| Имя | Назначение |
|---|---|
| `viTranslate`, `viTranslatePure`, `viTranslateHas` | перевод и проверка наличия перевода |
| `viTime` | длительность в секундах как `ч:мм:сс` |
| `viTruncate` | обрезка строки до заданной длины |
| `viFinance` | денежные суммы с разделителями |
| `viMomentDate`, `viMomentTime`, `viMomentDateFromNow`, `viMomentAdaptiveDate` | даты и время |
| `viCamelCase`, `viStartCase`, `viPrettify` | преобразование строк |
| `viSanitize` | доверенное содержимое для `innerHTML` |
| `viNgModelError` | текст ошибки для поля формы |
| `viAssetImage`, `viAssetIcon`, `viAssetFile`, `viAssetSound`, `viAssetVideo`, `viAssetBackground` | адреса ресурсов |

## Списки

`ListItems` — коллекция пунктов меню и действий с переводом подписей и фильтрацией. Подписи переводятся автоматически при смене языка:

```ts
let items = new ListItems<IListItem>(language);

let item = new ListItem('menu.edit', 0);
item.iconId = 'edit';
item.action = () => this.edit();
items.add(item);

items.complete();   // перевести подписи и отсортировать
items.refresh();    // пересчитать доступность пунктов
```

`SelectListItems` добавляет к этому выбранный элемент и событие `changed`, `RouterSelectListItems` связывает выбор с маршрутом.

## Окна и уведомления

Пакет объявляет абстракции, реализацию подключает `@ts-core/angular-material`:

```ts
let content = windows.open(EditComponent, new WindowConfig(true, false, 400));
content.events.pipe(takeUntil(content.destroyed)).subscribe(event => { /* … */ });

await windows.question('common.confirmation').yesNotPromise;
notifications.info('common.saved', null, undefined, { closeDuration: 4000 });
```

Содержимое окна наследует `IWindowContent`, содержимое уведомления — `INotificationContent`.

## Хранилища значений

Типизированные обёртки над `localStorage`:

```ts
let storage = new BooleanValueStorage(local, 'isMenuOpened', false);
storage.set(true);
storage.get();   // true
```

Есть варианты для строк, дат, JSON и классов: `ValueStorage`, `DateValueStorage`, `JSONValueStorage`, `ClassTypeValueStorage`.

## Вход в систему

`LoginServiceBase` описывает жизненный цикл входа, `LoginTokenStorage` хранит токен в `localStorage` и куках, охранники маршрутов ограничивают доступ:

| Класс | Назначение |
|---|---|
| `LoginGuard` | пускает только вошедших |
| `LoginNotGuard` | пускает только не вошедших |
| `LoginIfCanGuard` | пробует войти по сохранённому токену и пускает в любом случае |
| `LoginResolver`, `LoginRequireResolver` | дожидаются завершения входа до отрисовки маршрута |

## Структура проекта

```
src/
├── VIModule.ts             provideVI, viProviders, настройка приложения
├── application/            базовые компоненты приложения
├── asset/                  адреса ресурсов
├── cookie/                 работа с куками
├── directive/              директивы общего назначения
├── language/               переводы: пайпы, директивы, resolver
├── list/                   ListItems и SelectListItems
├── login/                  вход в систему и охранники маршрутов
├── menu/                   пункты меню и навигация
├── notification/           абстракции уведомлений
├── pipe/                   пайпы
├── question/               вопросы и их состояние
├── service/                платформа, маршруты, service worker
├── storage/                хранилища значений
├── theme/                  темы оформления
├── transport/              отложенная загрузка модулей транспорта
├── util/ViewUtil.ts        работа с разметкой
└── window/                 абстракции окон
```

## История изменений

### 22.0.1

- Поддержка Angular 22 и TypeScript 6
- Все директивы и пайпы стали самостоятельными, `standalone: false` снят
- Добавлены `provideVI`, `viProviders`, `provideTheme`, `provideLanguage`, `provideCookie` — настройка без `NgModule`
- Сборка переведена на `@angular/build:ng-packagr`
- Стили, переводы и скрипты кладёт в пакет сама сборка, а не отдельный шаг копирования

Публичный API не менялся: `VIModule.forRoot()` работает по-прежнему, селекторы директив и имена пайпов совпадают с предыдущими версиями.

## Лицензия

ISC © Renat Gubaev
