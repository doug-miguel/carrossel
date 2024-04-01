import { NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'carrossel';
  @ViewChild('wrapperSlider') wrapperSliderElement!: ElementRef<HTMLDivElement>;
  @ViewChild('slider') sliderElement!: ElementRef<HTMLUListElement>;

  public slider: HTMLElement | null = null;
  public offsetLeftValues: number[] = [];
  public distBoolean: boolean = false;
  public dist = { finalPosition: 0, movePosition: 0, startX: 0, movement: 0 }
  public index: { prev: number | undefined, active: number, next: number | undefined } = { prev: 0, active: 0, next: 0 }


  public carrosseis: string[] = [
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dwde2eed8d/large/1002638_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dw742ec92e/large/1002883_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dwfc86c10c/large/1003054_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dw07201522/large/1003107_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dwb16698d7/large/1002881_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dw82cb57c7/large/1003193_1.png',
    'https://www.cacaushow.com.br/on/demandware.static/-/Sites-masterCatalog_CacauShow/default/dw7a866863/large/1003220_1.png'
  ]

  ngOnInit(): void {
    this.slider = document.querySelector('.slider');
  }

  ngAfterViewInit(): void {
    this.slideConfig();
    this.changeSlider(0);
    this.transition(true);
  }

  private transition(activeSlider: boolean): void {
    if (this.slider)
      this.slider.style.transition = activeSlider ? '0.3s' : '';
  }

  public onDown(e: MouseEvent): void {
    e.preventDefault();
    this.distBoolean = true;
    this.dist.startX = e.clientX;
    this.transition(false);
  }

  public onTouchDown(e: TouchEvent): void {
    e.preventDefault();
    this.distBoolean = true;
    this.dist.startX = e.targetTouches[0].clientX;
    this.transition(false);
  }

  public onMove(e: MouseEvent): void {
    if (this.distBoolean) {
      const finalPosition = this.updatePosition(e.clientX);
      this.moveSlide(finalPosition);
    }
  }
  public onTouchMove(e: TouchEvent): void {
    if (this.distBoolean) {
      const finalPosition = this.updatePosition(e.targetTouches[0].clientX);
      this.moveSlide(finalPosition);
    }
  }

  public onEnd(): void {
    if (this.distBoolean) {
      this.dist.finalPosition = this.dist.movePosition;
      this.distBoolean = false;
      this.changeSlideOnEnd();
      this.transition(true);
    }
  }

  private changeSlideOnEnd(): void {
    if (this.dist.movement > 120 && this.index.next !== undefined) this.activeNextSlide();
    else if (this.dist.movement < -120 && this.index.prev !== undefined) this.activePrevSlide();
    else this.changeSlider(this.index.active);
  }

  private updatePosition(clientX: number): number {
    this.dist.movement = (this.dist.startX - clientX) * 1.8;
    return (this.dist.finalPosition - this.dist.movement);
  }

  private moveSlide(distX: number): void {
    this.dist.movePosition = distX;
    if (this.slider)
      this.slider.style.transform = `translate3d(${distX}px, 0 ,0)`;
  }

  private slidePosition(slider: any): number {
    const margin = (this.wrapperSliderElement.nativeElement.offsetWidth - slider.offsetWidth) / 2;
    return -(slider.offsetLeft - margin);
  }

  private slideConfig(): void {
    if (this.sliderElement) {
      const images = this.sliderElement.nativeElement.querySelectorAll('li img');
      images.forEach((element: HTMLElement | any): void => {
        const positionElement = this.slidePosition(element);
        this.offsetLeftValues.push(positionElement);
      });
    }
  }

  private changeSlider(index: number): void {
    this.moveSlide(this.offsetLeftValues[index]);
    this.sliderIndexNav(index);
    this.dist.finalPosition = this.offsetLeftValues[index];
  }

  private sliderIndexNav(index: number): void {
    const last = this.sliderElement.nativeElement.children.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    };
  }

  public activePrevSlide(): void {
    if (this.index.prev !== undefined) this.changeSlider(this.index.prev)
  }

  public activeNextSlide(): void {
    if (this.index.next !== undefined) this.changeSlider(this.index.next)
  }
}
