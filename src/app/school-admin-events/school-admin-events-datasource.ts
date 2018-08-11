import { EventId, Event } from './../home/home.component';
import { UserDetails } from './../initialise/initialise.component';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, first, tap, flatMap } from 'rxjs/operators';
import { Observable, Subscription, of, merge, from } from 'rxjs';
import { UserDetailsId } from '../initialise/initialise.component';
// TODO: Replace this with your own data model type
/**
 * Data source for the SchoolAdminEvents view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SchoolAdminEventsDataSource extends DataSource<EventId> {
  data: EventId[] = [];
  sub: Subscription;

  constructor(private afs: AngularFirestore, private authService: AuthService, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<EventId[]> {

    const dataMutations = [
      this.authService.getUser().pipe(first(), flatMap((user) => {
        console.log(user)
        return this.afs.collection<EventId>(`schools/${user.school}/events`).snapshotChanges();
      })).pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Event;
        const id = a.payload.doc.id;
        return { id, ...data };
      })), tap((val) => { this.data = val; })),
      this.paginator.page,
      this.sort.sortChange
    ];


    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {

  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: EventId[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: EventId[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(a.id, b.id, isAsc);
        case 'subtitle': return compare(a.subtitle, b.subtitle, isAsc);
        case 'capacity': return compare(a.capacity, b.capacity, isAsc);
        case 'participantCount': return compare(a.participants.length, b.participants.length, isAsc);
        case 'week': return compare(a.timetablePosition.week, b.timetablePosition.week, isAsc);
        case 'day': return compare(a.timetablePosition.day, b.timetablePosition.day, isAsc);
        case 'session': return compare(a.timetablePosition.session, b.timetablePosition.session, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
