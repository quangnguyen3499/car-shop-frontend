import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { SortDirection } from '@modules/tables/directives';
import { Country, Car } from '@modules/tables/models';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

interface SearchResult {
    total: number;
    cars: Car[] | null;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
}

function compare(v1: number | string, v2: number | string) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(cars: Car[] | null, column: string, direction: string): Car[] | null{
    if (direction === '') {
        return cars;
    } else {
        return [...cars].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(car: Car, term: string, pipe: PipeTransform) {
    return (
        car.name.toLowerCase().includes(term.toLowerCase())
    );
}


@Injectable({ providedIn: 'root' })
export class CountryService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _total$ = new BehaviorSubject<number>(0);
    private _cars$ = new BehaviorSubject<Car[] | null>([]);

    private _state: State = {
        page: 1,
        pageSize: 4,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private pipe: DecimalPipe, private http: HttpClient) {
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                debounceTime(120),
                switchMap(() => this._search()),
                delay(120),
                tap(() => this._loading$.next(false))
            )
            .subscribe(result => {
                this._cars$.next(result.cars);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get car$() {
        return this._cars$.asObservable();
    }
    get total$() {
        return this._total$.asObservable();
    }
    get loading$() {
        return this._loading$.asObservable();
    }
    get page() {
        return this._state.page;
    }
    set page(page: number) {
        this._set({ page });
    }
    get pageSize() {
        return this._state.pageSize;
    }
    set pageSize(pageSize: number) {
        this._set({ pageSize });
    }
    get searchTerm() {
        return this._state.searchTerm;
    }
    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: string) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    // private _search(): Observable<SearchResult> {
    //     const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    //     // 1. sort
    //     let countries = sort(COUNTRIES, sortColumn, sortDirection);

    //     // 2. filter
    //     countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    //     const total = countries.length;

    //     // 3. paginate
    //     countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    //     return of({ countries, total });
    // }
    
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
        const url_cars = "http://localhost:8000/api/v1/cars"
        var data: Car[] | null;

        this.http.get<Car[] | null>(url_cars, { observe: 'response'})
            .subscribe(response => { 
                data = sort(response.body, sortColumn, sortDirection)
            });
        
        // 2. filter
        cars = cars.filter(car => matches(car, searchTerm, this.pipe));
        const total = car_set.length;

        // 3. paginate
        data = car_set.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ data, total });
    }
}
