import { BehaviorSubject } from 'rxjs';
import { type FormPage } from '../../types';

class PageObserver {
  private scrollablePagesSubject = new BehaviorSubject<Array<FormPage>>([]);
  private pagesWithErrorsSubject = new BehaviorSubject<string[]>([]);
  private currentActivePageSubject = new BehaviorSubject<string | null>(null);

  setCurrentActivePage(page: string) {
    this.currentActivePageSubject.next(page);
  }

  updateScrollablePages(newPages: Array<FormPage>) {
    this.scrollablePagesSubject.next(newPages);
  }

  updatePagesWithErrors(newErrors: string[]) {
    this.pagesWithErrorsSubject.next(newErrors);
  }

  getScrollablePagesObservable() {
    return this.scrollablePagesSubject.asObservable();
  }

  getPagesWithErrorsObservable() {
    return this.pagesWithErrorsSubject.asObservable();
  }

  getCurrentActivePageObservable() {
    return this.currentActivePageSubject.asObservable();
  }
}

export const pageObserver = new PageObserver();
