FROM ubuntu:16.04

ENV DEBIAN_FRONTEND noninteractive

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
#RUN groupadd -r www-data && useradd -r --create-home -g www-data www-data

ENV HTTPD_PREFIX /usr/local/apache2
ENV PATH $PATH:$HTTPD_PREFIX/bin
RUN mkdir -p "$HTTPD_PREFIX" \
	&& chown www-data:www-data "$HTTPD_PREFIX"
WORKDIR $HTTPD_PREFIX

# install httpd runtime dependencies
# https://httpd.apache.org/docs/2.4/install.html#requirements
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		libapr1 \
		libaprutil1 \
		libpcre++0v5 \
		libssl1.0.0 \
	&& rm -r /var/lib/apt/lists/*

# see https://httpd.apache.org/download.cgi#verify
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys A93D62ECC3C8EA12DB220EC934EA76E6791485A8

ENV HTTPD_VERSION 2.4.27
ENV HTTPD_BZ2_URL http://archive.apache.org/dist/httpd/httpd-$HTTPD_VERSION.tar.bz2

RUN set -x \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates curl bzip2 gcc libapr1-dev libaprutil1-dev libc6-dev libpcre++-dev libssl-dev make \
	&& rm -r /var/lib/apt/lists/* \
	&& curl -SL "$HTTPD_BZ2_URL" -o httpd.tar.bz2 \
	&& curl -SL "$HTTPD_BZ2_URL.asc" -o httpd.tar.bz2.asc \
	&& gpg --verify httpd.tar.bz2.asc \
	&& mkdir -p src/httpd \
	&& tar -xvf httpd.tar.bz2 -C src/httpd --strip-components=1 \
	&& rm httpd.tar.bz2* \
	&& cd src/httpd \
	&& ./configure --enable-so --enable-ssl --prefix=$HTTPD_PREFIX \
	&& make -j"$(nproc)" \
	&& make install \
	&& cd ../../ \
	&& rm -r src/httpd \
	&& sed -ri ' \
		s!^(\s*CustomLog)\s+\S+!\1 /proc/self/fd/1!g; \
		s!^(\s*ErrorLog)\s+\S+!\1 /proc/self/fd/2!g; \
		' /usr/local/apache2/conf/httpd.conf \
	&& apt-get purge -y --auto-remove ca-certificates curl bzip2 gcc libapr1-dev libaprutil1-dev libc6-dev libpcre++-dev libssl-dev make

RUN apt-get update && apt-get -y install software-properties-common python-software-properties dialog apt-utils openjdk-8-jdk

RUN  sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list' && \
     apt-get -y install wget apt-transport-https && \
     wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -  && \
     apt-get update && \
     apt-get -y install google-chrome-stable

# Git install
RUN apt-get -y install git

# Sass install (need ruby)
RUN apt-get -y install \
                curl \
                zlib1g-dev \
                build-essential \
                libssl-dev \
                libreadline-dev \
                libyaml-dev \
                libsqlite3-dev \
                sqlite3 \
                libxml2-dev \
                libxslt1-dev \
                libcurl4-openssl-dev \
                software-properties-common\
                libffi-dev

RUN cd && \
    wget http://ftp.ruby-lang.org/pub/ruby/2.5/ruby-2.5.1.tar.gz && \
    tar -xzvf ruby-2.5.1.tar.gz && \
    cd ruby-2.5.1/ && \
    ./configure && \
    make && \
    make install && \
    ruby -v

RUN gem install bundler

RUN gem install sass -v 3.4.25

# Yarn install
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get -y install yarn

# Nodejs install
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs

# Cleanup
RUN apt-get -y autoremove

# Create default user
RUN useradd -ms /bin/bash user

# Fix issue with files watch
RUN echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

# Set timezone
RUN apt-get update && apt-get -y install tzdata; \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime; \
    echo "Asia/Shanghai" > /etc/timezone

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

COPY httpd.conf /usr/local/apache2/conf/httpd.conf

CMD ["/usr/local/bin/entrypoint.sh"]
