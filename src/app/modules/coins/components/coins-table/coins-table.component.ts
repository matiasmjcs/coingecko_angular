import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ICoin } from 'src/app/models/Icoins';
import { CoingeckoService } from 'src/app/services/coingecko.service';
import { FavoritesService } from 'src/app/services/favorites.service';

@Component({
  selector: 'app-coins-table',
  templateUrl: './coins-table.component.html',
  styleUrls: ['./coins-table.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule,
  ],
})
export class CoinsTableComponent implements OnInit {
  displayedColumns: string[] = [
    'symbol',
    'name',
    'high',
    'low',
    'price',
    'favorites',
  ];
  dataSource: MatTableDataSource<ICoin> = new MatTableDataSource();
  coins: ICoin[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    (await this.coingeckoService.getCoins()).subscribe((coins) => {
      this.coins = coins;
      this.dataSource = new MatTableDataSource(this.coins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  constructor(
    private coingeckoService: CoingeckoService,
    private favoritesService: FavoritesService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  favorite(coin: ICoin) {
    this.favoritesService.addFavorite(coin);
  }

  isFavorite(coin: ICoin) {
    return this.favoritesService.isFavoriteCharacter(coin);
  }
  removed(coin: ICoin) {
    this.favoritesService.removeFavorite(coin);
  }
}
