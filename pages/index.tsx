import { NextPageContext } from 'next'
import {extractFromCookie, extractFromCookie2, extractFromCookie3} from '../utils/cookie'
import Router, { withRouter } from 'next/router'
import {useState} from 'react'
import {Payload} from '../utils/cookie'
import {journalEntry} from '../utils/journals'
import styles from '../styles/Home.module.scss'
import React, {useEffect} from 'react'

interface Display {
  user:Payload,
  entries:journalEntry[]
}
//need error handling for journal entries, what to explain if no entries, etc...
//ADD NEXT COOKIE SO CAN EASILY GET THEM FROM THE CTX WITHOUT NEEDING A QUERY!
//TODO: make sure dates are recorded and brought back in the user's timezone

//"only absolute URLs are supported"?
//how to get the day from the clicked day?
//only on recompilation (client side?): querySrv EREFUSED 
//how to make sure welcome doesn't show on refresh?
//how to fix getEntry situation
//MORE EFFICIENT WAY OF GETTING THE JOURNAL ENTRY LIST AS CALENDER FORMAT?
//best way to style circles to ensure they stay centered in cell

//journal icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ1MC45NSAzMWgtMTYuMjNjMi4yODcgMTIuMDYuOTMxIDE1LjUyNSAxLjMzIDc4LjIyN2wyOS45LTcuNTEzdi01NS43MTRjMC04LjI4NC02LjcxNi0xNS0xNS0xNXoiIGZpbGw9IiNjMGNkZDEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNDM2LjA1IDE5OS4yMjcgMjkuOS03LjUxMnYtNTkuMDY4bC0yOS45IDcuNTEzeiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im00MzYuMDUgMjkwLjIxIDE4LjU1Ni00LjY2MmM2LjY2OS0xLjY3NiAxMS4zNDUtNy42NzEgMTEuMzQ1LTE0LjU0OHYtNDguMzUzbC0yOS45IDcuNTEzdjYwLjA1eiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im0xMzUuOTUgOTFoMTgwdjkwaC0xODB6IiBmaWxsPSIjYzBjZGQxIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTIyNiAzOTFjMC0zMy4wODQgMjYuOTE2LTYwIDYwLTYwaDEyMC4wNXYtMjg2YzAtMjQuODEzLTIwLjE4Ny00NS00NS00NWgtMzAwYy04LjI4NCAwLTE1IDYuNzE2LTE1IDE1djQ4MmMwIDguMjg0IDYuNzE2IDE1IDE1IDE1aDMwMGMyNC45ODIgMCA0NS0yMC4zNyA0NS00NC45NTV2LTE2LjA0NWgtMTIwLjA1Yy0zMy4wODQgMC02MC0yNi45MTYtNjAtNjB6bS0xMjAuMDUtMTk1di0xMjBjMC04LjI4NCA2LjcxNi0xNSAxNS0xNWgyMTBjOC4yODQgMCAxNSA2LjcxNiAxNSAxNXYxMjBjMCA4LjI4NC02LjcxNiAxNS0xNSAxNWgtMjEwYy04LjI4NCAwLTE1LTYuNzE2LTE1LTE1eiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im0yNTYgMzkxYzAgMTYuNTQyIDEzLjQ1OCAzMCAzMCAzMGgxNTAuMDV2LTYwaC0xNTAuMDVjLTE2LjU0MiAwLTMwIDEzLjQ1OC0zMCAzMHptNDUtLjA1YzAgOC4yODQtNi43MTYgMTUtMTUgMTVzLTE1LTYuNzE2LTE1LTE1IDYuNzE2LTE1IDE1LTE1IDE1IDYuNzE2IDE1IDE1eiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
//chart icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTUxMS42MDkgNDkzLjY0MXYtMjk3LjY0MWMwLTguMjg0LTYuNzE2LTE1LTE1LTE1aC02MS4zMThjLTguMjg0IDAtMTUgNi43MTYtMTUgMTV2Mjg2aC0yOC42ODJ2LTIyNmMwLTguMjg0LTYuNzE2LTE1LTE1LTE1aC02MS4zMThjLTguMjg0IDAtMTUgNi43MTYtMTUgMTV2MjI2aC0yOC41ODJ2LTIyNmMwLTguMjg0LTYuNzE2LTE1LTE1LTE1aC02MS4zMThjLTguMjg0IDAtMTUgNi43MTYtMTUgMTV2MjI2aC0yOS4zNDF2LTEzNmMwLTguMjg0LTYuNzE2LTE1LTE1LTE1aC02MS4zMTdjLTguMjg0IDAtMTUgNi43MTYtMTUgMTV2MTM2aC0yOS43MzN2LTQ2N2MwLTguMjg0LTYuNzE2LTE1LTE1LTE1cy0xNSA2LjcxNi0xNSAxNXY0ODJjMCA4LjI4NCA2LjcxNiAxNSAxNSAxNWg0ODJjOS41MDcgMCAxNi43OTYtOC44MTYgMTQuNjA5LTE4LjM1OXoiIGZpbGw9IiNjMGNkZDEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD48cGF0aCBkPSJtMTE0Ljk5OCAyNjguMDAyIDExNi4wNTEtODcuMDAyaDExNC45MDJjMy45NzggMCA3Ljc5My0xLjU4IDEwLjYwNi00LjM5NGw5NC4zOTQtOTQuMzk0djIzLjc4OGMwIDguMjg0IDYuNzE2IDE1IDE1IDE1czE1LTYuNzE2IDE1LTE1Yy0uMDAxLTE0LjIyNS4wMDItNTkuMDY4LS4wMDItNjAuMDQ0LS4wMjUtOC4xODktNi42ODMtMTQuOTU2LTE0Ljk5OC0xNC45NTZoLTU4LjljLTguMjg0IDAtMTUgNi43MTYtMTUgMTVzNi43MTYgMTUgMTUgMTVoMjIuNjg3bC05MCA5MGgtMTEzLjY4OGMtMy4yNDUgMC02LjQwMiAxLjA1Mi04Ljk5OCAyLjk5OGwtMTIwLjA1IDkwYy02LjYyOCA0Ljk3LTcuOTc0IDE0LjM3MS0zLjAwNCAyMSA0Ljk1MyA2LjYwNyAxNC4zNTIgNy45ODggMjEgMy4wMDR6IiBmaWxsPSIjYzBjZGQxIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvZz48L3N2Zz4=" />
//settings icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yMi42ODMgOS4zOTQtMS44OC0uMjM5Yy0uMTU1LS40NzctLjM0Ni0uOTM3LS41NjktMS4zNzRsMS4xNjEtMS40OTVjLjQ3LS42MDUuNDE1LTEuNDU5LS4xMjItMS45NzlsLTEuNTc1LTEuNTc1Yy0uNTI1LS41NDItMS4zNzktLjU5Ni0xLjk4NS0uMTI3bC0xLjQ5MyAxLjE2MWMtLjQzNy0uMjIzLS44OTctLjQxNC0xLjM3NS0uNTY5bC0uMjM5LTEuODc3Yy0uMDktLjc1My0uNzI5LTEuMzItMS40ODYtMS4zMmgtMi4yNGMtLjc1NyAwLTEuMzk2LjU2Ny0xLjQ4NiAxLjMxN2wtLjIzOSAxLjg4Yy0uNDc4LjE1NS0uOTM4LjM0NS0xLjM3NS41NjlsLTEuNDk0LTEuMTYxYy0uNjA0LS40NjktMS40NTgtLjQxNS0xLjk3OS4xMjJsLTEuNTc1IDEuNTc0Yy0uNTQyLjUyNi0uNTk3IDEuMzgtLjEyNyAxLjk4NmwxLjE2MSAxLjQ5NGMtLjIyNC40MzctLjQxNC44OTctLjU2OSAxLjM3NGwtMS44NzcuMjM5Yy0uNzUzLjA5LTEuMzIuNzI5LTEuMzIgMS40ODZ2Mi4yNGMwIC43NTcuNTY3IDEuMzk2IDEuMzE3IDEuNDg2bDEuODguMjM5Yy4xNTUuNDc3LjM0Ni45MzcuNTY5IDEuMzc0bC0xLjE2MSAxLjQ5NWMtLjQ3LjYwNS0uNDE1IDEuNDU5LjEyMiAxLjk3OWwxLjU3NSAxLjU3NWMuNTI2LjU0MSAxLjM3OS41OTUgMS45ODUuMTI2bDEuNDk0LTEuMTYxYy40MzcuMjI0Ljg5Ny40MTUgMS4zNzQuNTY5bC4yMzkgMS44NzZjLjA5Ljc1NS43MjkgMS4zMjIgMS40ODYgMS4zMjJoMi4yNGMuNzU3IDAgMS4zOTYtLjU2NyAxLjQ4Ni0xLjMxN2wuMjM5LTEuODhjLjQ3Ny0uMTU1LjkzNy0uMzQ2IDEuMzc0LS41NjlsMS40OTUgMS4xNjFjLjYwNS40NyAxLjQ1OS40MTUgMS45NzktLjEyMmwxLjU3NS0xLjU3NWMuNTQyLS41MjYuNTk3LTEuMzc5LjEyNy0xLjk4NWwtMS4xNjEtMS40OTRjLjIyNC0uNDM3LjQxNS0uODk3LjU2OS0xLjM3NGwxLjg3Ni0uMjM5Yy43NTMtLjA5IDEuMzItLjcyOSAxLjMyLTEuNDg2di0yLjI0Yy4wMDEtLjc1Ny0uNTY2LTEuMzk2LTEuMzE2LTEuNDg2em0tMTAuNjgzIDcuNjA2Yy0yLjc1NyAwLTUtMi4yNDMtNS01czIuMjQzLTUgNS01IDUgMi4yNDMgNSA1LTIuMjQzIDUtNSA1eiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" />
//right icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDEyMy45NjQgMTIzLjk2NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8cGF0aCBkPSJNMTIxLjcsNTcuNjgxTDgzLDI2Ljg4MWMtNC0zLjEtMTAtMC4zLTEwLDQuOHYxMC4zYzAsMy4zLTIuMiw2LjItNS41LDYuMkg2Yy0zLjMsMC02LDIuNC02LDUuOHYxNi4yYzAsMy4yLDIuNyw2LDYsNmg2MS41ICAgYzMuMywwLDUuNSwyLjYwMSw1LjUsNS45djEwLjNjMCw1LDYsNy44LDkuOSw0LjdsMzguNi0zMEMxMjQuNyw2NC43ODEsMTI0LjgsNjAuMDgxLDEyMS43LDU3LjY4MXoiIGZpbGw9IiNjMGNkZDEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" />
//left icon: <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDEyMy45NjQgMTIzLjk2NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoLTEsMCwwLDEsMTIzLjk2MzgzNjY2OTkyMTg4LDApIj4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Ik0xMjEuNyw1Ny42ODFMODMsMjYuODgxYy00LTMuMS0xMC0wLjMtMTAsNC44djEwLjNjMCwzLjMtMi4yLDYuMi01LjUsNi4ySDZjLTMuMywwLTYsMi40LTYsNS44djE2LjJjMCwzLjIsMi43LDYsNiw2aDYxLjUgICBjMy4zLDAsNS41LDIuNjAxLDUuNSw1Ljl2MTAuM2MwLDUsNiw3LjgsOS45LDQuN2wzOC42LTMwQzEyNC43LDY0Ljc4MSwxMjQuOCw2MC4wODEsMTIxLjcsNTcuNjgxeiIgZmlsbD0iI2MwY2RkMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
const Home = (data:Display) => {
  const [entry,setEntry] = useState('')
  const [submitFail, setSubmitFail] = useState(false)
  const [showEntries,setShowEntries] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(new Date(year,month,1).getDay())
  const [entries, setEntries] = useState(data.entries)
  //journal entry state

  useEffect(() => {
    //do journal entry call here
    if (window.sessionStorage.length === 0) {
      window.sessionStorage.setItem('welcome', 'true')
    }
    if (window.sessionStorage.getItem('welcome') === 'true') {
      setTimeout(function() {
        let screen = document.getElementById('removeFromDOM')
        if (screen === null)
        {
          return
        }
        screen.childNodes[0] != null && screen.removeChild(screen.childNodes[0])
        screen!.className = 'goodbye'
      }, 4000);
      sessionStorage.setItem('welcome','false')
    }
    else {
      let welcome = document.getElementById('removeFromDOM')
      if (welcome !=null && welcome.childNodes[0] != null) {
        welcome.removeChild(welcome.childNodes[0])
        welcome.className = 'goodbye'
      }
    }
    /*
    async (date: Date) => {
      try {
        const userID = data.user._id
        let response = await fetch('http://localhost:3000/api/getEntry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID,
            date
          }),
          credentials: "same-origin"
        })
        let entry = await response.text()
        console.log("GET ENTRY1: " + entry)
        if (entry.length<=2) {
          console.log("returning null")
          return //if it's just empty brackets
        }
        console.log("GET ENTRY: " + JSON.parse(entry))
        setToday(true)
        return 
      }
      catch (error) {
        console.log(error)
      }
      console.log('no')
      return
    }*/
  }, []);

  const logout = async () => {
    try {
      return await fetch('/api/logout', {
        method: 'DELETE',
      }).then(response=> {
        Router.replace('/auth')
      })
    }
    catch (error) {
      console.log(error)
      return
    }
  }

  const submitJournal = async (event: React.FormEvent<HTMLFormElement>) => {
    //event.preventDefault()
    setSubmitFail(false)
    if (entry == '') {
      event.preventDefault()
      setSubmitFail(true) //refreshes the page after this bc event.preventdefault()...
      return
    }
    try {
      console.log("MORE ID: " + data.user._id)
      const userID = data.user._id
      let date = new Date()
      return await fetch('/api/submitEntry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entry,
            userID,
            date
        }),
      })
    }
    catch (error) {
      console.log(error)
    }
    Router.replace('/')
    //window.location.reload()
    return
  }

  const getEntryDB = (date: Date) => {
    try {
      const userID = data.user._id
      fetch('http://localhost:3000/api/getEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          date
        }),
        credentials: "same-origin"
      })
      .then(response => response.json())
      .then((response) => {
        let testing = response.query
       // console.log("TESTING: " + testing)
        if (testing === undefined) {
          //console.log("returning null")
          setEntry('')
          //console.log("ENTRY: " + entry)
          return
        }
        let ent = JSON.parse(JSON.stringify(testing)).entry
        setEntry(ent)
        //console.log("ENTRY: " + entry)
      })
      /*
      let entry = await response.text()
      console.log("GET ENTRY1: " + entry)
      if (entry.length<=2) {
        console.log("returning null")
        return //if it's just empty brackets
      }
      console.log("GET ENTRY: " + JSON.parse(entry))
      setToday(true)
      return 
      */
    }
    catch (error) {
      console.log(error)
    }
    return
  }

  return (
    <>
      <div id="removeFromDOM" className={styles.welcome}><div className={styles.message}>Welcome back, {data.user.username}</div></div>
      <div className={styles.screen}>
      <div className={styles.menu}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          {`${['January','February','March','April','May','June','July','August','September','October','November','December'][month]} ${year}`}
        </div>
        <div className={styles.calender}>
          <div className={styles.daysContainer}>
            {['Su','M','Tu','W','Th','F','Sa'].map((day) => {
              return (
                <span className={styles.daysWeek}>{day}</span>
            )})}
          </div>
          {[...Array(35)].map((day, index) => {
            let calNum = index+1-startDay
            if (index < startDay) {
              return (
                <div className={styles.cell}>
                </div>
              )
            }
            else if (calNum === new Date().getDate()) { //probably will still display if you look at previous months
              getEntryDB(new Date())
              if (entry=='') {
                return (
                  //MAKE THIS CLICKABLE TO CREATE NEW ENTRY
                  <div className={styles.today}>
                  </div>
                )
              }
            } 
            return (
              <div className={styles.cell}>
                {(calNum) <= new Date(year, month+1, 0).getDate() && 
                  <div className={styles.dateNum}>{calNum}</div>}
                {data.entries[index] != null &&
                  <div className={styles.circle}></div>
                }
              </div>
              //DoES THIS LOGIC HOLD??? GETS LAST DAY OF PREVIOUS MONTH?
          )})}
          {/*<form onSubmit={submitJournal}>
            <textarea onChange={(event:React.ChangeEvent<HTMLTextAreaElement>) => {setEntry(event.currentTarget.value)}}/>
            <br />
            <button type="submit">Submit</button>
            {submitFail && (
              <p>Your journal entry should not be empty!</p>
            )}
            </form>*/}
          {/*<button onClick={()=>setShowEntries(!showEntries)}>Show/hide journal entries</button>*/}
        </div>
      </div>
      {showEntries && (
        <div>
          {/*Final will have these each in their own calender square correlating to the date they were created -- ADD DATE TO DB. Open in a pop up? only one entry per day. import calender module? view mood trend graph?*/}
          {data.entries.map((entry) => {
            return (
              <>
              <pre white-space='pre-wrap' key={entry._id}>{entry.entry}</pre>
              <p>=================</p>
              {/*to edit entry: add a button that turns the entry display into a textarea w default value of what's already written, then have a 
              save changes button to call an update api route, page must refresh after? also add delete entry w a little symbol too */}
              </>
            )
          })}
        </div>
      )}
      {/*<button onClick={logout}>Logout</button>*/}
      </div>
    </>
  )
}

Home.getInitialProps = async (ctx: NextPageContext) => { //QUESTION: only activates server-side, but I have to route from login to here on client-side
  let user: Payload | null = null
  if (ctx.query.user) {
    user = JSON.parse(Array.isArray(ctx.query.user) ? ctx.query.user[ 0 ] : ctx.query.user)
    console.log("CLIENT USER" + JSON.stringify(user))
  }

  console.log("HEADERS " + ctx.req?.headers.cookie)


  if (ctx.req) {
    console.log("COOKIE OUT" + ctx.req.headers.cookie)
    user = await extractFromCookie3(ctx.req.headers.cookie!)
    console.log("SERVER USER" + JSON.stringify(user))
  }

  if (!user && !ctx.req) {
    Router.replace('/auth')
    return {}
  }
  else if (!user && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: 'http://localhost:3000/auth'
    })
    ctx.res?.end()
    return {}
  }
  const userID = user?._id
  let response: Response | null = null

  if (ctx.req) {
    try {
      response = await fetch('http://localhost:3000/api/getEntries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': ctx.req.headers.cookie as string
        },
        body: JSON.stringify({
          date: new Date()
        }),
        credentials: "same-origin"
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    try {
      response = await fetch('http://localhost:3000/api/getEntries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date()
        }),
        credentials: "same-origin"
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  

  let entries = (response !== null) ? await response.json() : []
  //TODO: Only get entries for a month

  console.log(entries)
  console.log("USER: " + user?.username + " " + user?._id)

  return {user, entries}
}

export default Home
