import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { CommonModule } from '@angular/common'; // Required for *ngFor and other directives
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-seat-reservation',
  standalone: true,
  imports: [FormsModule, CommonModule], // Import FormsModule and CommonModule
  templateUrl: './seat-reservation.component.html',
  styleUrls: ['./seat-reservation.component.scss'],
})
export class SeatReservationComponent {
  seats: boolean[][] = []; // 2D array to represent seat rows
  requiredSeats: number = 1; // Number of seats user wants to reserve

  constructor(private toastr: ToastrService) {
    this.initializeSeats();
  }

  // Initialize seat layout (7 seats per row, last row 3 seats)
  initializeSeats() {
    this.seats = []; // Reset the seats array
    for (let i = 0; i < 11; i++) {
      if (i === 10) {
        this.seats.push([false, false, false]); // Last row has only 3 seats
      } else {
        this.seats.push([false, false, false, false, false, false, false]); // Other rows have 7 seats
      }
    }
  }

  // Reserve seats based on the number entered by the user
  reserveSeats() {
    let seatsToReserve = this.requiredSeats;
    let seatsBooked = [];
    let availableSeats = 0;

    // Count the total available seats
    for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
      availableSeats += this.seats[rowIndex].filter((seat) => !seat).length;
    }

    // If there aren't enough available seats
    if (seatsToReserve > availableSeats) {
      this.toastr.error('Not enough seats available.'); // Show error toast
      return;
    }

    // First try to reserve seats in a single row if possible
    for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
      let consecutiveSeats = 0; // Counter for consecutive empty seats in this row
      let firstEmptySeatIndex = -1; // To track the first empty seat in the row

      // Try to find a sequence of empty seats in the row
      for (
        let seatIndex = 0;
        seatIndex < this.seats[rowIndex].length;
        seatIndex++
      ) {
        if (!this.seats[rowIndex][seatIndex]) {
          if (consecutiveSeats === 0) {
            firstEmptySeatIndex = seatIndex; // Mark the first empty seat
          }
          consecutiveSeats++;
        } else {
          consecutiveSeats = 0; // Reset counter if seat is reserved
          firstEmptySeatIndex = -1;
        }

        // If the required seats can be booked in this row, reserve them
        if (consecutiveSeats === seatsToReserve) {
          for (let i = 0; i < seatsToReserve; i++) {
            this.seats[rowIndex][firstEmptySeatIndex + i] = true;
            seatsBooked.push(rowIndex * 7 + firstEmptySeatIndex + i + 1);
          }
          seatsToReserve = 0;
          break;
        }
      }

      if (seatsToReserve === 0) {
        break; // Stop if all required seats are reserved
      }
    }

    // If not all seats were reserved, we book remaining seats across rows
    if (seatsToReserve > 0) {
      for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
        for (
          let seatIndex = 0;
          seatIndex < this.seats[rowIndex].length;
          seatIndex++
        ) {
          if (!this.seats[rowIndex][seatIndex] && seatsToReserve > 0) {
            this.seats[rowIndex][seatIndex] = true;
            seatsBooked.push(rowIndex * 7 + seatIndex + 1);
            seatsToReserve--;
          }
          if (seatsToReserve === 0) {
            break;
          }
        }
        if (seatsToReserve === 0) {
          break;
        }
      }
    }

    // If there are still seats to reserve, show error toast
    if (seatsToReserve > 0) {
      this.toastr.error('Not enough seats available.'); // Show error toast
    } else {
      this.toastr.success('Seats reserved: ' + seatsBooked.join(', ')); // Show success toast with reserved seat numbers
    }
  }

  // Reset the seats to their initial state
  resetSeats() {
    this.initializeSeats();
  }
}
