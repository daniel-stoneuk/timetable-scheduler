import { UserDetails } from './../initialise/initialise.component';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, first, tap, flatMap } from 'rxjs/operators';
import { Observable, of, merge, from } from 'rxjs';
import { UserDetailsId } from '../initialise/initialise.component';

// TODO: Replace this with your own data model type
/**
 * Data source for the SchoolAdminStudents view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SchoolAdminStudentsDataSource extends DataSource<UserDetailsId> {
  data: UserDetailsId[] = [];

  constructor(private afs: AngularFirestore, private authService: AuthService, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<UserDetailsId[]> {

    const dataMutations = [
      this.authService.getUser().pipe(first(), flatMap((user) => {
        return this.afs.collection<UserDetailsId>(`schools/${user.school}/user-details`).snapshotChanges();
      })).pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as UserDetails;
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
  private getPagedData(data: UserDetailsId[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: UserDetailsId[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'displayName': return compare(a.displayName.split(' ')[1], b.displayName.split(' ')[1], isAsc);
        case 'id': return compare(a.id, b.id, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'requiredEventCount': return compare(a.requiredEventCount, b.requiredEventCount, isAsc);
        case 'eventsToJoin': return compare((a.requiredEventCount - a.joinedEvents), (b.requiredEventCount - b.joinedEvents), isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
