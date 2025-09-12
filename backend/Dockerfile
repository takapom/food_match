FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install certificates and build deps
RUN apk add --no-cache ca-certificates tzdata build-base

# Cache go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./

# Final image
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata && \
    adduser -D -u 10001 appuser

WORKDIR /app
COPY --from=builder /app/server /app/server

ENV PORT=8080
EXPOSE 8080

USER appuser

CMD ["/app/server"]
