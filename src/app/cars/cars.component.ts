import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-cars',
  imports: [ReactiveFormsModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent {
  http = inject(HttpClient);
  cars: any = [];
  mainImgStyle = {};  
  orderImgStyle = {};
  carsFilter = [
    {
      active: true,
      name: 'Все марки',
    },
    {
      active: false,
      name: 'Lamborghini',
    },
    {
      active: false,
      name: 'Ferrari',
    },
    {
      active: false,
      name: 'Porsche',
    },
    {
      active: false,
      name: 'BMW',
    },
    {
      active: false,
      name: 'Mercedes',
    },
    {
      active: false,
      name: 'Chevrolet',
    },
    {
      active: false,
      name: 'Audi',
    },
    {
      active: false,
      name: 'Ford',
    },
  ];

  orderForm = new FormGroup({
    car: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
  });

  @HostListener("document:scroll", ["$event"])
  onScroll() {
    const offsetRight = -576 + window.scrollY * 0.2;
    this.mainImgStyle = { right: offsetRight + "px" };
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    this.orderImgStyle = {
      transform: "translate3d(" + (e.clientX * 0.3) / 8 + "px," + (e.clientY * 0.3) / 8 + "px,0px)"
    };
  }

  ngOnInit() {
    this.getCars("");
  }

  getCars(filter: string) {
    this.http.get("https://testologia.ru/cars-data", {params: {filter: filter}})
    .subscribe(data => this.cars = data);
  }



  changeFilter(filter: any, carsContent: HTMLElement) {
    this.carsFilter.forEach((el) => (el.active = false));
    filter.active = true;

    this.getCars(filter.name);

    carsContent.scrollIntoView({ behavior: 'instant' });
  }

  isError(fildName: string) {
    const control = this.orderForm.get(fildName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  sendOrder() {
    if (this.orderForm.valid) {
      this.http
        .post('https://testologia.ru/cars-order', this.orderForm.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.orderForm.reset();
          },
          error: (response: any) => {
            alert(response.error.message);
          },
        });
      // alert('Спасибо за заявку! Мы скоро свяжемся с вами!');
    }
  }
}
